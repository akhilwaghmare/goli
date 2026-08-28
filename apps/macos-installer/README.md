# Goli macOS installer

`build-pkg.sh` creates an unsigned installer package after compiling the local service and packaging the Electron desktop app. The installer needs administrator approval because it reserves `go.li` in `/etc/hosts`, installs a Goli-only local CA, starts loopback-only services on ports 80 and 443, and registers `goli://admin`.

It refuses to replace an existing `go.li` host mapping or another service on ports 80 or 443. The app uses the fixed `/usr/local/libexec/goli/goli-maintenance` commands through an administrator prompt for repair, certificate reset, and uninstall. The uninstall flow can retain or remove the local SQLite database.
