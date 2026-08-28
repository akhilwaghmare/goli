package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
)

func newTestServer(t *testing.T) *Server {
	t.Helper()
	s, err := New(filepath.Join(t.TempDir(), "links.db"), "test")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { s.Close() })
	return s
}
func request(s *Server, method, target, body string, origin bool) *httptest.ResponseRecorder {
	r := httptest.NewRequest(method, target, bytes.NewBufferString(body))
	r.Host = "go.li"
	if origin {
		r.Header.Set("Origin", "https://go.li")
	}
	r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	s.ServeHTTP(w, r)
	return w
}

func TestValidation(t *testing.T) {
	if _, err := validSlug("Bad slug"); err == nil {
		t.Fatal("expected invalid slug")
	}
	if _, err := validSlug("admin"); err == nil {
		t.Fatal("expected reserved slug")
	}
	if _, err := validDestination("javascript:alert(1)"); err == nil {
		t.Fatal("expected unsafe URL rejection")
	}
	if _, err := validDestination("https://example.com/a"); err != nil {
		t.Fatal(err)
	}
}
func TestCreateRedirectAndVisits(t *testing.T) {
	s := newTestServer(t)
	created := request(s, "POST", "/api/links", `{"slug":"resume","destinationUrl":"https://example.com/resume"}`, true)
	if created.Code != 201 {
		t.Fatalf("create=%d %s", created.Code, created.Body.String())
	}
	redirect := request(s, "GET", "/resume", "", false)
	if redirect.Code != 302 || redirect.Header().Get("Location") != "https://example.com/resume" {
		t.Fatalf("redirect=%d %s", redirect.Code, redirect.Header().Get("Location"))
	}
	links := request(s, "GET", "/api/links", "", false)
	var got []Link
	if err := json.Unmarshal(links.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}
	if len(got) != 1 || got[0].Visits != 1 {
		t.Fatalf("links=%+v", got)
	}
}

func TestLinkCanBeEdited(t *testing.T) {
	s := newTestServer(t)
	created := request(s, "POST", "/api/links", `{"slug":"before","destinationUrl":"https://example.com"}`, true)
	var link Link
	if err := json.Unmarshal(created.Body.Bytes(), &link); err != nil {
		t.Fatal(err)
	}
	updated := request(s, "PATCH", "/api/links/"+link.ID, `{"slug":"after","destinationUrl":"https://example.org"}`, true)
	if updated.Code != http.StatusOK || !bytes.Contains(updated.Body.Bytes(), []byte(`"slug":"after"`)) {
		t.Fatalf("update=%d %s", updated.Code, updated.Body.String())
	}
}

func TestCrossOriginWriteIsRejected(t *testing.T) {
	s := newTestServer(t)
	w := request(s, "POST", "/api/links", `{"slug":"safe","destinationUrl":"https://example.com"}`, false)
	if w.Code != http.StatusForbidden {
		t.Fatalf("got %d", w.Code)
	}
}

func TestDashboardRouteIsNotAvailable(t *testing.T) {
	s := newTestServer(t)
	w := request(s, "GET", "/admin", "", false)
	if w.Code != http.StatusNotFound {
		t.Fatalf("dashboard route should be removed: %d", w.Code)
	}
}

func TestHealthIncludesVersion(t *testing.T) {
	s := newTestServer(t)
	w := request(s, "GET", "/api/health", "", false)
	if w.Code != http.StatusOK || !bytes.Contains(w.Body.Bytes(), []byte(`"version":"test"`)) {
		t.Fatalf("health=%d %s", w.Code, w.Body.String())
	}
}

func TestUnknownSlugReturnsNotFound(t *testing.T) {
	s := newTestServer(t)
	w := request(s, "GET", "/missing", "", false)
	if w.Code != http.StatusNotFound || !bytes.Contains(w.Body.Bytes(), []byte("open Goli")) {
		t.Fatalf("unknown slug response: %d", w.Code)
	}
}

func TestImportConflictIsAtomic(t *testing.T) {
	s := newTestServer(t)
	request(s, "POST", "/api/links", `{"slug":"existing","destinationUrl":"https://example.com"}`, true)
	body := `{"version":1,"links":[{"slug":"new","destinationUrl":"https://example.org"},{"slug":"existing","destinationUrl":"https://example.net"}]}`
	w := request(s, "POST", "/api/import", body, true)
	if w.Code != http.StatusConflict {
		t.Fatalf("got %d", w.Code)
	}
	links := request(s, "GET", "/api/links", "", false)
	var got []Link
	json.Unmarshal(links.Body.Bytes(), &got)
	if len(got) != 1 || got[0].Slug != "existing" {
		t.Fatalf("partial import: %+v", got)
	}
}
