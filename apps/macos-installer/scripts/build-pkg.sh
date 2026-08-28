#!/bin/bash
set -euo pipefail

# Keep AppleDouble metadata files out of the distributable package.
export COPYFILE_DISABLE=1

root_dir="$(cd "$(dirname "$0")/../../.." && pwd)"
service_dir="$root_dir/apps/local-service"
installer_dir="$root_dir/apps/macos-installer"
desktop_app="$root_dir/apps/desktop/release/mac-arm64/Goli.app"
build_dir="$(mktemp -d)"
trap 'rm -rf "$build_dir"' EXIT

command -v go >/dev/null || { echo "Go 1.22 or newer is required to build the local service." >&2; exit 1; }
[[ -d "$desktop_app" ]] || { echo "Desktop build missing. Run bun run build:desktop first." >&2; exit 1; }
mkdir -p "$build_dir/root/usr/local/libexec/goli" "$build_dir/root/Library/LaunchDaemons" "$build_dir/root/Applications" "$build_dir/scripts" "$root_dir/dist"
(cd "$service_dir" && go build -ldflags "-X main.version=${VERSION:-0.1.0}" -o "$build_dir/root/usr/local/libexec/goli/goli" ./cmd/golinks)
cp "$installer_dir/scripts/uninstall.sh" "$build_dir/root/usr/local/libexec/goli/uninstall.sh"
chmod 755 "$build_dir/root/usr/local/libexec/goli/uninstall.sh"
cp "$installer_dir/scripts/setup.sh" "$build_dir/root/usr/local/libexec/goli/setup.sh"
cp "$installer_dir/scripts/goli-maintenance" "$build_dir/root/usr/local/libexec/goli/goli-maintenance"
chmod 755 "$build_dir/root/usr/local/libexec/goli/setup.sh" "$build_dir/root/usr/local/libexec/goli/goli-maintenance"
cp -R "$desktop_app" "$build_dir/root/Applications/Goli.app"
cp "$installer_dir/launchd/com.golinks.local.plist" "$build_dir/root/Library/LaunchDaemons/com.goli.local.plist"
cp "$installer_dir/scripts/postinstall" "$build_dir/scripts/postinstall"
chmod 755 "$build_dir/scripts/postinstall"
# pkgbuild otherwise includes AppleDouble sidecar files created by macOS copy
# operations. The temporary root is created by this script and contains only
# package payload, so removing these sidecars is safe.
/usr/bin/find "$build_dir/root" -type f -name '._*' -delete
/usr/bin/xattr -cr "$build_dir/root"
pkgbuild --root "$build_dir/root" --scripts "$build_dir/scripts" --identifier com.goli.local --version "${VERSION:-0.1.0}" --install-location / --filter '(^|/)\._.*$' --filter '(^|/)\.DS_Store$' --filter '(^|/)(\.svn|CVS)(/|$)' "$build_dir/goli-component.pkg"
productbuild --package "$build_dir/goli-component.pkg" "$root_dir/dist/goli-macos.pkg"
echo "Created $root_dir/dist/goli-macos.pkg"
