# Goli macOS installer

`build-pkg.sh` creates an unsigned installer package after compiling the local service. The installer needs administrator approval because it reserves `go.li` in `/etc/hosts`, installs a Goli-only local CA, starts loopback-only services on ports 80 and 443, and registers `goli://admin`.

It refuses to replace an existing `go.li` host mapping or another service on ports 80 or 443. Run `sudo /usr/local/libexec/goli/uninstall.sh` after installation to remove the daemon, app, managed host entry, and Goli certificate material; it intentionally retains the local SQLite database for backup.
