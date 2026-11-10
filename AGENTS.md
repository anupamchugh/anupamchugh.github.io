# Repository Guidelines (anupamchugh.github.io)

The owner's personal site and blog at https://anupamchugh.github.io: a Next.js 16 static export (Tailwind, React 18). This repository is public: everything committed is published, so never commit private paths, account IDs, tokens, raw agent sessions or personal data, and keep unreviewed notes in the git-ignored `private-notes/`.

## Structure

- `app/` holds the pages (App Router), `components/` the React components, `lib/` the content loaders (`lib/posts.ts`, `lib/content.ts`, `lib/themes.ts`).
- Posts are Markdown in `docs/_posts/YYYY-MM-DD-slug.md` with front matter (`title`, `date`, `categories`, `keywords`; agent reports add an `agent:` block, see README "Agent journal"). `docs/_posts` is the live archive, not legacy Jekyll. `_drafts/` and `content/drafts/` are drafts; `draft: true` only hides a post from the site, the file is still public.
- Site data lives in `content/apps.json`, `content/resume.json` and `content/portfolio-archive.json`, read by `lib/content.ts`; edit those, not `public/apps.json` or `public/resume.json`, which the build regenerates.
- Themes are defined in `lib/themes.ts` (seven themes, default `modern`; on 10 Nov 2026), with styles in `app/globals.css`.
- `specs/` and `docs/plans/` are tracked and public. `BLOG_MANIFEST.yaml` is a hand-kept post review index generated 6 Feb 2026, so it lags the posts.

## Build and test

- `npm ci`, then `npm run build`: it runs `script/fetch-medium.mjs` (Medium RSS into `content/medium.json`, keeps the committed snapshot when offline), `script/sync-public-json.mjs` (App Store version lookup, writes `public/apps.json` and `public/resume.json`, may update versions in `content/apps.json`), then `next build --webpack` into `out/`. Passing: the build exits 0 and `out/` exists.
- After a build, `git diff` shows refreshed `content/medium.json`, `content/apps.json` and `public/*.json`; commit them only when the change is meant to ship them.
- `npm test` runs `node --test tests/*.test.mjs`. Several tests read `out/`, so build first. Passing: the `# fail 0` summary line; quote the `# pass` count.
- `npm run check:store` checks App Store listings against `content/apps.json` (unverified on 10 Nov 2026). `npm run lint` calls `next lint`, which Next 16 removed (unverified); CI does not lint.
- `npm run dev` serves on port 3000 (also `.claude/launch.json`); dev mode shows drafts, production hides them.
- Pull requests to `main` run `.github/workflows/pr-checks.yml`: `npm ci`, `npm run build`, `npm test` on Node 20.

## Content rules

- Use Markdown images (`![alt](src)`) in posts: the renderer drops raw `<img>` and `<div>` HTML (commit `acc9ebc`).
- Every image in `public/showcase/img/` needs a source and date entry in `tools/showcase/provenance.json`, and no `.json` file may sit in that folder; `tests/showcase.test.mjs` enforces both (unprovenanced images were removed in `6c28506`).
- PDFs are binary in `.gitattributes`; a résumé PDF was once corrupted by text handling (`ae62b18`). Keep the line.
- The built résumé must show the JournalDev years `2015–2019` and never "present" for that role; `script/publish.sh` checks this.

## Tasks

- `.beads/` is a local ledger, git-ignored since 10 Nov 2026 (it was tracked from `b1e0887` until then). On 10 Nov 2026 it had no issue prefix and no issues, so there is no beads loop here. Do not create beads or set a prefix without the owner.

## Commit

- Subjects are plain sentences saying what changed on the site (`Post: ...` for a post), e.g. `Offer three résumé downloads on the résumé page`.

## Publishing

- A push to `main` publishes the site: `.github/workflows/deploy.yml` builds and deploys `out/` to GitHub Pages on every push to `main` and daily at 01:17 UTC (Medium refresh).
- `script/publish.sh` is a second, owner-run path that builds, runs `script/check-export.sh` (fail-closed secret scan of `out/`) and pushes `out/` to `docs/` on the `gh-pages` branch. Its header says Pages serves `gh-pages` and Actions is not used, which contradicts `deploy.yml`; a past session found the live site matched the Actions deploy of `main` on 8 Nov 2026. Read the Pages source (`gh api repos/<owner>/anupamchugh.github.io/pages`) before deciding which path publishes, and never run `publish.sh` without the owner's approval.
- Before any push, run `script/check-export.sh out` after a build; it must print `export scan clean: N` with N above zero.
