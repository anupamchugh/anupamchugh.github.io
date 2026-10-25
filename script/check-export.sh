#!/bin/bash
# Usage: script/check-export.sh DIR
# Stops (exit 1) unless the secret scan of DIR ran, reported at least one file checked, and found nothing,
# and DIR holds no private file. A scan that exits 0 without saying it checked files does not count.
# EXPORT_SCANNER replaces the scanner in tests only.
set -euo pipefail

dir="${1:?usage: check-export.sh DIR}"
here="$(cd "$(dirname "$0")" && pwd -P)"
scanner="${EXPORT_SCANNER:-$here/scan-export.mjs}"

report="$(node "$scanner" "$dir")"
printf '%s\n' "$report"
if ! printf '%s\n' "$report" | grep -Eq '^export scan clean: [1-9]'; then
  echo "stopping: the export scan did not report any files checked." >&2
  exit 1
fi

if find "$dir" \( -iname '*private-notes*' -o -name '.env*' -o -name '*.pem' -o -name '*.p8' -o -name '*.p12' \) | grep -q .; then
  echo "stopping: the export contains a private file." >&2
  exit 1
fi
