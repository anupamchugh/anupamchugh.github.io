# blog rehaul review

## current story

poetic subtitle options:

- started in code. got pulled into the creator economy. tried ai scaffolding. came back to human writing.
- ten years online: code, creators, scaffolds, then the sentence again.
- from tutorials to traffic to agents to voice.
- i learned to write for platforms. now i am writing my way back out.
- code taught me systems. medium taught me incentives. ai taught me speed. writing is teaching me restraint.

the site now uses the first option because it is the clearest homepage spine.

## audit snapshot

local inventory checked on 2026-05-06:

- 134 local post/draft files across `docs/_posts`, `content/drafts`, and `_drafts`
- 89 posts/drafts missing explicit excerpt or description metadata
- 56 ios tutorial-era posts
- 70 ai workflow posts/notes
- 7 humor/satire pieces detected locally
- 7 draft files outside the published post directory
- 1 static html duplicate/leak: `docs/_posts/2026-01-31-Where-Did-I-Leave-That-Spec.html`

## curation policy

do not put every old post on the homepage.

- homepage gets best work, live apps, and recent writing
- `/work` gets apps, open source, takeout, better programming, and active experiments
- old tutorials stay searchable as an archive
- humor/satire gets a curated shelf, not the main identity
- stockshots stays marked as building until the product is actually live

## edit queue

### rewrite by hand

- `docs/_posts/2026-03-14-ten-years-of-doing-stuff.md`
  - keep as source material, but rewrite manually
  - current draft is rich but too complete for a homepage/about substitute
  - likely new title: `ten years online`

### fix metadata

- add excerpts/descriptions to the top 25 posts before any SEO/social pass
- prioritize 2026 ai workflow essays, 2019-2021 best tutorials, and career pieces

### dedupe/cleanup

- remove or archive `docs/_posts/2026-01-31-Where-Did-I-Leave-That-Spec.html`
- decide whether draft roots should be one place only: `content/drafts`

### humor/satire shelf

local candidates:

- `docs/_posts/2020-04-19-If-Programming-Languages-Had-Honest-Slogans.md`
- `docs/_posts/2020-04-19-What-if-brand-slogans-were-brutally-honest.md`
- `docs/_posts/2020-04-25-If-Apps-Were-People-You-Knew-107d97eaea9.md`
- `docs/_posts/2020-05-04-If-Trump-was-a-Programmer.md`
- `docs/_posts/2020-06-20-If-Netflix-Was-Your-Girlfriend-c54d704646a9.md`
- `docs/_posts/2024-02-15-Satire-On-Loyal-Employee-and-CEO.md`

medium/substack humor should be imported later and reviewed into this shelf.

## flyleaf product direction

flyleaf should not be an anupam-only blog editor.

consumer promise:

> a markdown writing desk for people who publish from folders, github repos, and old platform exports.

private repo import:

- github device login or personal access token
- request repo contents permission, not full account write by default
- clone/open repo locally on mac, or use github contents api on ios
- create a branch for edits
- save drafts locally first
- push as commit or pull request only after explicit confirmation

workspace types:

- folder workspace: local markdown folders
- github workspace: public or private repos after auth
- archive workspace: medium/substack/wordpress exports
- template workspace: jekyll, hugo, astro, next.js, obsidian

the personal blog should be the first dogfood workspace, not the whole product.
