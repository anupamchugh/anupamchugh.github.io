#!/bin/bash
# Owner-run. Builds the static site and pushes out/ to the gh-pages branch.
# Run it when you want the site updated. It is not scheduled and it does not start a launchd agent.
# GitHub Pages for this repo serves gh-pages at /docs (recorded 2026-10-23). Actions is not used.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

visibility="$(gh repo view --json visibility,isPrivate --jq '"\(.visibility) private=\(.isPrivate)"')"
echo "repo visibility: $visibility"
case "$visibility" in
  *private=true*) ;;
  *)
    echo "stopping: this script only pushes while the repo is private."
    exit 1
    ;;
esac

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
if 'children\\":\\"\\"' not in window and 'children":""' not in window:
    sys.exit("JournalDev date was not the empty value")
PY

if find "$root/out" -iname '*private-notes*' -o -name '.env' -o -name '*.pem' | grep -q .; then
  echo "stopping: the export contains a private file."
  exit 1
fi

work="$(mktemp -d)"
cleanup() { git worktree remove --force "$work" >/dev/null 2>&1 || rm -rf "$work"; }
trap cleanup EXIT

git fetch origin gh-pages
git worktree add --detach "$work" origin/gh-pages
rm -rf "$work/docs"
mkdir -p "$work/docs"
rsync -a --delete --exclude '.DS_Store' --exclude '.git' "$root/out/" "$work/docs/"
: > "$work/docs/.nojekyll"

git -C "$work" add -A docs
if git -C "$work" diff --cached --quiet; then
  echo "gh-pages already matches this build."
  exit 0
fi

git -C "$work" commit -m "$(cat <<'EOF'
Publish the static site from the Mac

The built pages replace docs/ on gh-pages, which is the branch GitHub Pages serves. Actions is not used.

Co-Authored-By: Grok 4.7 <noreply@x.ai>
EOF
)"

git -C "$work" push origin HEAD:gh-pages
echo "pushed gh-pages"
