package localservice

import (
	_ "embed"

	"github.com/go-links/local-service/internal/server"
)

//go:embed web/admin.html
var adminHTML []byte

// New creates the loopback-only Goli HTTP service.
func New(dbPath string) (*server.Server, error) { return server.New(dbPath, adminHTML) }
