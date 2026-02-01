# anupamchugh.github.io

## Project Identity

**This is:** Public GitHub Pages blog at https://anupamchugh.github.io
**Tech:** Next.js 16, Tailwind, GitHub Actions deploy
**Alias:** "blog", "gh-blog"

**Related but different:**
- `/workspace/blogging` - Old Swift/Publish blog (internal, rarely updated)

## Quick Start

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
git push origin main # Auto-deploys via GitHub Actions
```

## Structure

```
app/           # Next.js app router
components/    # React components
lib/           # Utilities
public/        # Static assets
docs/          # Legacy Jekyll content (being migrated)
```

## Skills Available

- `/blog-forge` - Scaffold features, analyze patterns
- `/design-primitives` - WCAG contrast, type-scale, spacing
- `/blog-theme` - Switch themes with HN blog pattern recommendations

## Theme System

4 themes available via toggle in header:

| Theme | Style | Inspired By |
|-------|-------|-------------|
| default | Dark slate, sky accents | simonwillison, brandur |
| minimal | HN cream, serif, 640px | paulgraham, danluu, gwern |
| terminal | Green-on-black, scanlines | Retro hacker aesthetic |
| neon | Purple/cyan glow | Cyberpunk |

Files: `lib/themes.ts`, `lib/theme-context.tsx`, `app/globals.css`

## Protection

- `specs/` in .gitignore (private specs stay local)
- Pre-commit hook blocks sensitive files
