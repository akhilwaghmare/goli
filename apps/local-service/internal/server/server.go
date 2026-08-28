package server

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"regexp"
	"strings"

	_ "modernc.org/sqlite"
)

var slugPattern = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)
var reserved = map[string]bool{"admin": true, "api": true, "assets": true, "health": true, "favicon.ico": true}

type Link struct {
	ID             string `json:"id"`
	Slug           string `json:"slug"`
	DestinationURL string `json:"destinationUrl"`
	CreatedAt      string `json:"createdAt"`
	UpdatedAt      string `json:"updatedAt"`
	Visits         int64  `json:"visits"`
}
type linkInput struct {
	Slug           string `json:"slug"`
	DestinationURL string `json:"destinationUrl"`
}
type exportFile struct {
	Version int    `json:"version"`
	Links   []Link `json:"links"`
}
type Server struct {
	db        *sql.DB
	adminHTML []byte
}

func New(dbPath string, adminHTML []byte) (*Server, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}
	s := &Server{db: db, adminHTML: adminHTML}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, destination_url TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, visits INTEGER NOT NULL DEFAULT 0)`)
	if err != nil {
		db.Close()
		return nil, err
	}
	return s, nil
}
func (s *Server) Close() error { return s.db.Close() }

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Host != "go.li" && r.Host != "go.li:80" && r.Host != "127.0.0.1" && r.Host != "127.0.0.1:80" {
		http.Error(w, "invalid host", http.StatusBadRequest)
		return
	}
	switch {
	case r.URL.Path == "/":
		http.Redirect(w, r, "/admin", http.StatusFound)
	case r.URL.Path == "/admin":
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(s.dashboard())
	case strings.HasPrefix(r.URL.Path, "/api/"):
		s.api(w, r)
	default:
		s.redirect(w, r)
	}
}

func (s *Server) dashboard() []byte {
	return s.adminHTML
}

func validSlug(v string) (string, error) {
	v = strings.ToLower(strings.TrimSpace(v))
	if len(v) < 1 || len(v) > 64 || !slugPattern.MatchString(v) || reserved[v] {
		return "", errors.New("slug must be 1–64 lowercase letters, numbers, or hyphens and cannot be reserved")
	}
	return v, nil
}
func validDestination(v string) (string, error) {
	u, err := url.ParseRequestURI(strings.TrimSpace(v))
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
		return "", errors.New("destination must be a complete http or https URL")
	}
	return u.String(), nil
}
func id() string {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		panic(fmt.Sprintf("generate link ID: %v", err))
	}
	return hex.EncodeToString(buf)
}
func (s *Server) create(in linkInput) (Link, error) {
	slug, err := validSlug(in.Slug)
	if err != nil {
		return Link{}, err
	}
	destination, err := validDestination(in.DestinationURL)
	if err != nil {
		return Link{}, err
	}
	link := Link{ID: id(), Slug: slug, DestinationURL: destination}
	_, err = s.db.Exec(`INSERT INTO links (id,slug,destination_url) VALUES (?,?,?)`, link.ID, link.Slug, link.DestinationURL)
	if err != nil {
		return Link{}, err
	}
	return s.get(link.ID)
}
func (s *Server) get(id string) (Link, error) {
	var l Link
	err := s.db.QueryRow(`SELECT id,slug,destination_url,created_at,updated_at,visits FROM links WHERE id=?`, id).Scan(&l.ID, &l.Slug, &l.DestinationURL, &l.CreatedAt, &l.UpdatedAt, &l.Visits)
	return l, err
}
func (s *Server) list() ([]Link, error) {
	rows, err := s.db.Query(`SELECT id,slug,destination_url,created_at,updated_at,visits FROM links ORDER BY slug`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Link
	for rows.Next() {
		var l Link
		if err := rows.Scan(&l.ID, &l.Slug, &l.DestinationURL, &l.CreatedAt, &l.UpdatedAt, &l.Visits); err != nil {
			return nil, err
		}
		out = append(out, l)
	}
	return out, rows.Err()
}
func (s *Server) update(id string, in linkInput) (Link, error) {
	slug, err := validSlug(in.Slug)
	if err != nil {
		return Link{}, err
	}
	destination, err := validDestination(in.DestinationURL)
	if err != nil {
		return Link{}, err
	}
	r, err := s.db.Exec(`UPDATE links SET slug=?,destination_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`, slug, destination, id)
	if err != nil {
		return Link{}, err
	}
	n, _ := r.RowsAffected()
	if n == 0 {
		return Link{}, sql.ErrNoRows
	}
	return s.get(id)
}
func (s *Server) delete(id string) error {
	r, err := s.db.Exec(`DELETE FROM links WHERE id=?`, id)
	if err != nil {
		return err
	}
	n, _ := r.RowsAffected()
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (s *Server) redirect(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
	if _, err := validSlug(slug); err != nil {
		s.notFound(w)
		return
	}
	var target string
	err := s.db.QueryRow(`SELECT destination_url FROM links WHERE slug=?`, slug).Scan(&target)
	if err == sql.ErrNoRows {
		s.notFound(w)
		return
	}
	if err != nil {
		http.Error(w, "database error", 500)
		return
	}
	if _, err = s.db.Exec(`UPDATE links SET visits=visits+1,updated_at=CURRENT_TIMESTAMP WHERE slug=?`, slug); err != nil {
		http.Error(w, "database error", 500)
		return
	}
	http.Redirect(w, r, target, http.StatusFound)
}
func (s *Server) notFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprint(w, `<!doctype html><title>Link not found</title><style>body{font:16px system-ui;margin:12vh auto;max-width:34rem;padding:2rem;color:#17241e}a{color:#17623a}</style><h1>That link does not exist.</h1><p>Check the shortcut and try again, or <a href="/admin">open Goli</a>.</p>`)
}

func (s *Server) api(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet && r.Method != http.MethodHead && r.Header.Get("Origin") != "https://go.li" {
		writeError(w, http.StatusForbidden, "requests must come from the local Goli dashboard")
		return
	}
	p := strings.TrimPrefix(r.URL.Path, "/api/")
	switch {
	case p == "health" && r.Method == http.MethodGet:
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	case p == "links" && r.Method == http.MethodGet:
		links, err := s.list()
		if err != nil {
			writeError(w, 500, "database error")
			return
		}
		json.NewEncoder(w).Encode(links)
	case p == "links" && r.Method == http.MethodPost:
		var in linkInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeError(w, 400, "invalid JSON")
			return
		}
		l, err := s.create(in)
		if err != nil {
			writeDBError(w, err)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(l)
	case strings.HasPrefix(p, "links/") && r.Method == http.MethodPatch:
		var in linkInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeError(w, 400, "invalid JSON")
			return
		}
		l, err := s.update(strings.TrimPrefix(p, "links/"), in)
		if err != nil {
			writeDBError(w, err)
			return
		}
		json.NewEncoder(w).Encode(l)
	case strings.HasPrefix(p, "links/") && r.Method == http.MethodDelete:
		err := s.delete(strings.TrimPrefix(p, "links/"))
		if err != nil {
			writeDBError(w, err)
			return
		}
		w.WriteHeader(204)
	case p == "export" && r.Method == http.MethodGet:
		links, err := s.list()
		if err != nil {
			writeError(w, 500, "database error")
			return
		}
		w.Header().Set("Content-Disposition", "attachment; filename=goli-export.json")
		json.NewEncoder(w).Encode(exportFile{Version: 1, Links: links})
	case p == "import" && r.Method == http.MethodPost:
		s.importLinks(w, r)
	default:
		writeError(w, 404, "not found")
	}
}
func (s *Server) importLinks(w http.ResponseWriter, r *http.Request) {
	var in exportFile
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.Version != 1 {
		writeError(w, 400, "invalid Goli export")
		return
	}
	tx, err := s.db.Begin()
	if err != nil {
		writeError(w, 500, "database error")
		return
	}
	defer tx.Rollback()
	seen := map[string]bool{}
	for _, l := range in.Links {
		slug, err := validSlug(l.Slug)
		if err != nil || seen[slug] {
			writeError(w, 400, "import contains invalid or duplicate slugs")
			return
		}
		seen[slug] = true
		destination, err := validDestination(l.DestinationURL)
		if err != nil {
			writeError(w, 400, "import contains an invalid destination")
			return
		}
		var exists int
		tx.QueryRow(`SELECT COUNT(*) FROM links WHERE slug=?`, slug).Scan(&exists)
		if exists > 0 {
			writeError(w, 409, "import conflicts with an existing slug: "+slug)
			return
		}
		if _, err = tx.Exec(`INSERT INTO links (id,slug,destination_url,visits) VALUES (?,?,?,?)`, id(), slug, destination, l.Visits); err != nil {
			writeError(w, 500, "database error")
			return
		}
	}
	if err = tx.Commit(); err != nil {
		writeError(w, 500, "database error")
		return
	}
	w.WriteHeader(204)
}
func writeError(w http.ResponseWriter, status int, message string) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
func writeDBError(w http.ResponseWriter, err error) {
	if errors.Is(err, sql.ErrNoRows) {
		writeError(w, 404, "link not found")
		return
	}
	if strings.Contains(err.Error(), "UNIQUE constraint failed") {
		writeError(w, 409, "that slug is already in use")
		return
	}
	writeError(w, 400, err.Error())
}
