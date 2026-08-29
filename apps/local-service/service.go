package localservice

import (
	"github.com/goli/local-service/internal/server"
)

// New creates the loopback-only Goli HTTP service.
func New(dbPath string) (*server.Server, error) { return NewWithVersion(dbPath, "dev") }

// NewWithVersion creates the loopback-only Goli HTTP service with build metadata.
func NewWithVersion(dbPath, version string) (*server.Server, error) {
	return server.New(dbPath, version)
}
