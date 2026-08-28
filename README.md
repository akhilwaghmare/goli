# Goli

Goli gives a Mac personal browser shortcuts such as `go.li/resume`. It has two products in one repository:

- `apps/website`: the public Next.js product and installation site.
- `apps/local-service`: the loopback-only Go service that serves redirects at `https://go.li/*`.
- `apps/desktop`: the Electron management app for shortcuts, diagnostics, repair, and updates.
- `apps/macos-installer`: scripts and launchd configuration for the unsigned macOS installer.

## Development

Run `bun install`, then `bun run dev` to develop the website or `bun run dev:desktop` for the macOS app. The local service requires Go 1.22+; run its tests with `cd apps/local-service && go test ./...`.

Run `bun run package:macos` on a Mac with Go and Xcode command-line tools to produce `dist/goli-macos.pkg`. The installer uses administrator permission to reserve `go.li` in `/etc/hosts`, install a trusted Goli-only local certificate authority, bind local-only services to ports 80 and 443, and register `goli://admin`. It safely stops if either port is already in use.

Link data is SQLite in `/Library/Application Support/Goli/links.db`. The desktop app supports JSON export/import; its uninstall flow can retain or remove that data.
