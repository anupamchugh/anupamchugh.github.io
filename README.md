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
