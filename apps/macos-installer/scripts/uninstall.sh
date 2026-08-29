#!/bin/bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then echo "Run with sudo: sudo $0" >&2; exit 1; fi
plist="/Library/LaunchDaemons/app.akhil.goli.plist"
cert_dir="/Library/Application Support/Goli/certs"
/bin/launchctl bootout system "$plist" 2>/dev/null || true
/bin/rm -f "$plist"
/usr/bin/sed -i '' '/# goli managed$/d' /etc/hosts
/usr/bin/security delete-certificate -c "Goli Local CA" /Library/Keychains/System.keychain 2>/dev/null || true
/bin/rm -rf "$cert_dir"
/bin/rm -rf "/Applications/Goli.app"
/bin/rm -rf "/usr/local/libexec/goli"
echo "Goli service, app, and hostname mapping were removed. Local data remains in /Library/Application Support/Goli for backup or manual removal."
