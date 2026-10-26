#!/bin/bash
# Owner-run. Builds the static site and pushes out/ to the gh-pages branch.
# Run it when you want the site updated. It is not scheduled and it does not start a launchd agent.
# GitHub Pages for this repo serves gh-pages at /docs (recorded 2026-10-23). Actions is not used.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$root"

npm run build
npm test

resume="$root/out/resume/index.html"
test -f "$resume"
python3 - "$resume" <<'PY'
import sys
html = open(sys.argv[1], encoding="utf-8").read()
start = html.find("JournalDev")
if start < 0:
    sys.exit("JournalDev block missing from the built resume")
window = html[start:start + 450]
if "present" in window.lower():
    sys.exit("JournalDev line contains present")
if "2015–2019" not in html:
    sys.exit("JournalDev years 2015–2019 missing from the built resume")
PY

# Fail closed: any secret-shaped text or private file in the export, a scan that cannot run, and a scan that
# does not say how many files it checked all stop the publish. It prints file paths and rule names, never the
# matched text. The same check runs again below on the bytes that get committed.
"$root/script/check-export.sh" "$root/out"

work="$(mktemp -d)"
cleanup() { git worktree remove --force "$work" >/dev/null 2>&1 || rm -rf "$work"; }
trap cleanup EXIT

git fetch origin gh-pages
git worktree add --detach "$work" origin/gh-pages
rm -rf "$work/docs"
mkdir -p "$work/docs"
rsync -a --delete --exclude '.DS_Store' --exclude '.git' "$root/out/" "$work/docs/"
: > "$work/docs/.nojekyll"

"$root/script/check-export.sh" "$work/docs"

git -C "$work" add -A docs
if git -C "$work" diff --cached --quiet; then
  echo "gh-pages already matches this build."
  exit 0
fi

coauthor="${PUBLISH_COAUTHOR:-Grok 4.7 <noreply@x.ai>}"
git -C "$work" commit -m "Publish the static site from the Mac

The built pages replace docs/ on gh-pages, which is the branch GitHub Pages serves. Actions is not used.

Co-Authored-By: $coauthor"

git -C "$work" push origin HEAD:gh-pages
echo "pushed gh-pages"
