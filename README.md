# Goli

Goli gives a Mac personal browser shortcuts such as `go.li/resume`. It has two products in one repository:

- `apps/website`: the public Next.js product and installation site.
- `apps/local-service`: the loopback-only Go service that serves redirects at `https://go.li/*`.
- `apps/desktop`: the Electron management app for shortcuts, diagnostics, repair, and updates.
- `apps/macos-installer`: scripts and launchd configuration for the unsigned macOS installer.

## Development

Run `bun install`, then `bun run dev` to develop the website or `bun run dev:desktop` for the macOS app. The local service requires Go 1.22+; run its tests with `cd apps/local-service && go test ./...`.

Run `bun run package:macos` on a Mac with Go and Xcode command-line tools to produce `dist/goli-macos.pkg`. The installer uses administrator permission to reserve `go.li` in `/etc/hosts`, install a trusted Goli-only local certificate authority, bind local-only services to ports 80 and 443, and register `goli://admin`. It safely stops if either port is already in use.

## Desktop releases

Pushing a `vX.Y.Z` tag builds the ARM64 macOS package and creates an immutable GitHub Release containing the package and its checksum manifest. Installed Goli apps check that stable feed shortly after launch and periodically afterwards; users choose when to download and open the verified package.

These packages are currently unsigned and unnotarized. macOS may require the user to approve Goli in **System Settings → Privacy & Security** before opening it or its installer. Native in-place Electron updates are intentionally deferred until the app is code-signed.

Link data is SQLite in `/Library/Application Support/Goli/links.db`. The desktop app supports JSON export/import; its uninstall flow can retain or remove that data.
