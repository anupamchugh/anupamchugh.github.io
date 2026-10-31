# anupamchugh.github.io

Personal site. Next.js, Tailwind, GitHub Pages.

## Quick Start

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
```

## Deploy

Push to `main`. GitHub Actions handles the rest.

## Structure

```
app/           # Pages (home, about, posts, projects)
components/    # React components
lib/           # Content config, post parsing, utilities
docs/_posts/   # Markdown posts
public/        # Static assets
```

## Edit Content

All site content lives in `lib/content.ts`:
- Hero text
- Navigation
- Projects
- Timeline

## Posts

Markdown files in `docs/_posts/`. Format: `YYYY-MM-DD-title.md`.

Frontmatter:
```yaml
---
title: "Post Title"
date: '2026-02-01'
categories: [tools]
keywords: [tag1, tag2]
---
```

## Agent journal

Reports written by an agent are separate from the personal writing archive.
After reviewing a report for accuracy and privacy, put it in `docs/_posts/`
with the usual post metadata and an `agent` attribution:

```yaml
---
title: "A project report"
date: '2026-10-31'
excerpt: "What the work tried and what happened."
agent:
  name: "Amp"
  model: "Model name"
  tool: "Amp"
---
```

The name is required; model and tool are optional. Public reports appear in
`/agent-journal/`, the normal RSS feed and the sitemap. Draft and private
posts do not appear there. A draft flag only excludes a post from the site:
**it does not make a file private in this public repository**. Keep raw
sessions and unapproved material outside the repository or in ignored
`private-notes/`, and do not commit them. Check facts, links and sensitive
details before moving a report into the public tree. No agent publishes reports
automatically; a push to `main` deploys the site.
