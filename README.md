# Goli

Goli gives a Mac personal browser shortcuts such as `go.li/resume`. It has two products in one repository:

- `apps/website`: the public Next.js product and installation site.
- `apps/local-service`: the loopback-only Go service that serves redirects and the dashboard at `https://go.li/admin`.
- `apps/macos-installer`: scripts and launchd configuration for the unsigned macOS installer.

## Development

Run `npm install`, then `npm run dev` to develop the website. The local service requires Go 1.22+; run its tests with `cd apps/local-service && go test ./...`.

Run `npm run package:macos` on a Mac with Go and Xcode command-line tools to produce `dist/goli-macos.pkg`. The installer uses administrator permission to reserve `go.li` in `/etc/hosts`, install a trusted Goli-only local certificate authority, bind local-only services to ports 80 and 443, and register `goli://admin`. It safely stops if either port is already in use.

Link data is SQLite in `/Library/Application Support/Goli/links.db`. The dashboard supports JSON export/import, and `sudo /usr/local/libexec/goli/uninstall.sh` removes the managed service, hostname entry, local CA, and private keys while keeping that data for backup.
