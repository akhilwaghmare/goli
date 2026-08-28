package localservice

import (
	"bytes"
	"net/http/httptest"
	"path/filepath"
	"testing"
)

func TestServiceRespondsToHealthCheck(t *testing.T) {
	s, err := New(filepath.Join(t.TempDir(), "links.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { s.Close() })
	r := httptest.NewRequest("GET", "/api/health", nil)
	r.Host = "go.li"
	w := httptest.NewRecorder()
	s.ServeHTTP(w, r)
	if w.Code != 200 || !bytes.Contains(w.Body.Bytes(), []byte(`"status":"ok"`)) {
		t.Fatalf("health response is invalid: status=%d body=%d bytes", w.Code, w.Body.Len())
	}
}
