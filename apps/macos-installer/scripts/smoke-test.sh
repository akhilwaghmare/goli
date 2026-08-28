#!/bin/bash
set -euo pipefail

binary="/usr/local/libexec/goli/goli-maintenance"
[[ -x "$binary" ]] || { echo "Goli is not installed." >&2; exit 1; }
"$binary" status | /usr/bin/python3 -c 'import json,sys; status=json.load(sys.stdin); assert "service" in status; print("Goli maintenance status is readable.")'
curl --fail --silent --show-error https://go.li/api/health >/dev/null
echo "Goli service health check passed."
