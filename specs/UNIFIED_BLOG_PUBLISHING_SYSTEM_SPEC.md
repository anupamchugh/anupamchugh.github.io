# Unified Blog Publishing System Spec

**Status:** Draft
**Created:** 2026-02-03
**Category:** Developer Tooling / Content Management
**Scope:** anupamchugh.github.io + global skills

---

## Problem Statement

Current blog workflow has friction at every step:

| Step | Current | Pain |
|------|---------|------|
| Create post | Manually create file + frontmatter | Tedious, error-prone |
| Draft/Publish toggle | Edit `published: true/false` in file | Easy to forget, no validation |
| Preview drafts | Run local dev server | Can't share with reviewers |
| Share for review | No mechanism | Must publish to share |
| Polish writing | Manual or separate skill | Not integrated |
| Multi-model review | Separate skill | Not integrated |

**Result:** 6 scattered skills (`blog`, `quick-blog`, `publish-journal`, `sync-blogs`, `blog-this`, `blog-analyzer`) that don't compose well.

---

## Solution: One Unified `@blog` Skill + MCP Tool

### Jesse Vincent Pattern

**One skill, one backing tool, all actions:**

```
@blog <action> [args]
```

| Action | Command | What It Does |
|--------|---------|--------------|
| `create` | `@blog create "Title"` | Scaffold post with frontmatter |
| `list` | `@blog list [drafts\|published\|unlisted]` | Show posts by status |
| `draft` | `@blog draft <slug>` | Set `published: false` |
| `publish` | `@blog publish <slug>` | Set `published: true`, commit, push |
| `unlisted` | `@blog unlisted <slug>` | Visible at URL, not indexed |
| `polish` | `@blog polish <slug>` | Elements of Style pass |
| `review` | `@blog review <slug>` | Multi-model review (Claude + Gemini) |
| `preview` | `@blog preview <slug>` | Return local dev URL |
| `share` | `@blog share <slug>` | Push to preview branch, return Vercel URL |
| `status` | `@blog status <slug>` | Show post metadata + publish state |

---

## Architecture

### Skill: `@blog`

**Location:** `~/.claude/skills/blog/SKILL.md`

```yaml
---
name: blog
description: Unified blog management - create, publish, share, review posts on anupamchugh.github.io
triggers:
  - "blog create"
  - "publish post"
  - "share draft"
  - "review blog post"
---
```

**Prose content:** Maps user intent → `blog_action()` MCP tool calls.

### MCP Tool: `blog_action()`

**Location:** Global MCP (not project-specific)

```python
@mcp.tool()
async def blog_action(
    action: str,
    slug: str = None,
    title: str = None,
    content: str = None,
    status: str = None,  # draft | published | unlisted
    expires: str = None,  # For share links: "24h", "7d"
) -> dict:
    """
    Unified blog management for anupamchugh.github.io.

    Actions:
    - create: Scaffold new post (requires title)
    - list: Show posts (optional status filter)
    - draft: Set post to unpublished
    - publish: Set published=true, commit, push
    - unlisted: Set unlisted=true (visible but not indexed)
    - polish: Run Elements of Style pass
    - review: Multi-model review
    - preview: Return local dev URL
    - share: Create preview branch, return Vercel URL
    - status: Show post metadata

    Examples:
    - blog_action(action="create", title="My Post")
    - blog_action(action="publish", slug="my-post")
    - blog_action(action="share", slug="my-post", expires="24h")
    """
```

---

## Frontmatter Schema

### Current (Jekyll legacy in `docs/_posts/`)

```yaml
---
title: "Post Title"
date: '2026-02-03T12:00:00.000Z'
categories: [ai, software-engineering]
keywords: [keyword1, keyword2]
slug: /post-slug
published: false  # true = live, false = hidden
---
```

### Extended (new fields)

```yaml
---
title: "Post Title"
date: '2026-02-03T12:00:00.000Z'
categories: [ai, software-engineering]
keywords: [keyword1, keyword2]
slug: /post-slug
published: false
unlisted: false     # NEW: visible at URL but not in index/RSS
reviewed: false     # NEW: has passed review gate
review_notes: ""    # NEW: notes from last review
share_branch: ""    # NEW: preview branch name if shared
---
```

---

## Post States

```
┌─────────────┐
│   CREATE    │
│ (draft)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   DRAFT     │────▶│  UNLISTED   │
│ published:  │     │ unlisted:   │
│   false     │     │   true      │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  PUBLISHED  │◀────│  PUBLISHED  │
│ indexed     │     │ + unlisted  │
└─────────────┘     └─────────────┘
```

| State | `published` | `unlisted` | Behavior |
|-------|-------------|------------|----------|
| Draft | `false` | `false` | Not deployed |
| Unlisted | `true` | `true` | Deployed, not in index/RSS |
| Published | `true` | `false` | Fully public |

---

## Implementation

### Phase 1: Core Actions (P0)

**Files to create:**

1. **Skill:** `~/.claude/skills/blog/SKILL.md`
2. **MCP Tool:** `~/Desktop/workspace/mcp/blog-mcp/server.py`

**Actions in Phase 1:**
- `create` - Scaffold post
- `list` - List posts by status
- `draft` - Set unpublished
- `publish` - Publish, commit, push
- `status` - Show metadata

### Phase 2: Sharing & Preview (P1)

**Actions:**
- `unlisted` - Deploy but hide from index
- `preview` - Local dev URL
- `share` - Vercel preview branch

**Requires:**
- `unlisted` frontmatter support in Next.js
- Vercel preview deployment integration

### Phase 3: Review Integration (P2)

**Actions:**
- `polish` - Elements of Style pass
- `review` - Multi-model review

**Requires:**
- Integration with `writing-clearly-and-concisely` skill
- Integration with `review` skill (Claude + Gemini)

---

## MCP Tool Implementation

```python
# ~/Desktop/workspace/mcp/blog-mcp/server.py

import os
import re
import yaml
import subprocess
from datetime import datetime
from pathlib import Path
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("blog-mcp")

BLOG_ROOT = Path.home() / "Desktop/workspace/anupamchugh.github.io"
POSTS_DIR = BLOG_ROOT / "docs/_posts"


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML frontmatter and body from markdown."""
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if match:
        return yaml.safe_load(match.group(1)), match.group(2)
    return {}, content


def write_frontmatter(metadata: dict, body: str) -> str:
    """Combine frontmatter and body into markdown."""
    return f"---\n{yaml.dump(metadata, default_flow_style=False)}---\n{body}"


@mcp.tool()
async def blog_action(
    action: str,
    slug: str = None,
    title: str = None,
    content: str = None,
    status: str = None,
) -> dict:
    """Unified blog management."""

    if action == "create":
        if not title:
            return {"error": "Title required for create action"}

        # Generate slug and filename
        slug = title.lower().replace(" ", "-").replace("'", "")
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        date_str = datetime.now().strftime("%Y-%m-%d")
        filename = f"{date_str}-{slug.title().replace('-', '-')}.md"

        # Scaffold frontmatter
        metadata = {
            "title": title,
            "date": datetime.now().isoformat(),
            "categories": [],
            "keywords": [],
            "slug": f"/{slug}",
            "published": False,
        }

        filepath = POSTS_DIR / filename
        filepath.write_text(write_frontmatter(metadata, "\n\nYour content here.\n"))

        return {
            "status": "created",
            "file": str(filepath),
            "slug": slug,
            "next": f"Edit {filepath}, then run: @blog publish {slug}",
        }

    elif action == "list":
        posts = []
        for f in POSTS_DIR.glob("*.md"):
            content = f.read_text()
            meta, _ = parse_frontmatter(content)
            post_status = "published" if meta.get("published") else "draft"
            if meta.get("unlisted"):
                post_status = "unlisted"

            if status and post_status != status:
                continue

            posts.append({
                "file": f.name,
                "title": meta.get("title", "Untitled"),
                "slug": meta.get("slug", ""),
                "status": post_status,
                "date": meta.get("date", ""),
            })

        return {"posts": sorted(posts, key=lambda x: x["date"], reverse=True)}

    elif action == "publish":
        if not slug:
            return {"error": "Slug required for publish action"}

        # Find post by slug
        for f in POSTS_DIR.glob("*.md"):
            content = f.read_text()
            meta, body = parse_frontmatter(content)
            if meta.get("slug", "").strip("/") == slug.strip("/"):
                meta["published"] = True
                meta["unlisted"] = False
                f.write_text(write_frontmatter(meta, body))

                # Git commit and push
                subprocess.run(["git", "add", str(f)], cwd=BLOG_ROOT)
                subprocess.run(
                    ["git", "commit", "-m", f"publish: {meta.get('title', slug)}"],
                    cwd=BLOG_ROOT
                )
                subprocess.run(["git", "push"], cwd=BLOG_ROOT)

                return {
                    "status": "published",
                    "url": f"https://anupamchugh.github.io{meta['slug']}",
                    "file": f.name,
                }

        return {"error": f"Post with slug '{slug}' not found"}

    elif action == "draft":
        if not slug:
            return {"error": "Slug required for draft action"}

        for f in POSTS_DIR.glob("*.md"):
            content = f.read_text()
            meta, body = parse_frontmatter(content)
            if meta.get("slug", "").strip("/") == slug.strip("/"):
                meta["published"] = False
                f.write_text(write_frontmatter(meta, body))

                subprocess.run(["git", "add", str(f)], cwd=BLOG_ROOT)
                subprocess.run(
                    ["git", "commit", "-m", f"draft: {meta.get('title', slug)}"],
                    cwd=BLOG_ROOT
                )
                subprocess.run(["git", "push"], cwd=BLOG_ROOT)

                return {"status": "draft", "file": f.name}

        return {"error": f"Post with slug '{slug}' not found"}

    elif action == "status":
        if not slug:
            return {"error": "Slug required for status action"}

        for f in POSTS_DIR.glob("*.md"):
            content = f.read_text()
            meta, body = parse_frontmatter(content)
            if meta.get("slug", "").strip("/") == slug.strip("/"):
                word_count = len(body.split())
                return {
                    "file": f.name,
                    "title": meta.get("title"),
                    "slug": meta.get("slug"),
                    "published": meta.get("published", False),
                    "unlisted": meta.get("unlisted", False),
                    "date": meta.get("date"),
                    "categories": meta.get("categories", []),
                    "word_count": word_count,
                }

        return {"error": f"Post with slug '{slug}' not found"}

    elif action == "unlisted":
        if not slug:
            return {"error": "Slug required for unlisted action"}

        for f in POSTS_DIR.glob("*.md"):
            content = f.read_text()
            meta, body = parse_frontmatter(content)
            if meta.get("slug", "").strip("/") == slug.strip("/"):
                meta["published"] = True
                meta["unlisted"] = True
                f.write_text(write_frontmatter(meta, body))

                subprocess.run(["git", "add", str(f)], cwd=BLOG_ROOT)
                subprocess.run(
                    ["git", "commit", "-m", f"unlisted: {meta.get('title', slug)}"],
                    cwd=BLOG_ROOT
                )
                subprocess.run(["git", "push"], cwd=BLOG_ROOT)

                return {
                    "status": "unlisted",
                    "url": f"https://anupamchugh.github.io{meta['slug']}",
                    "note": "Post is live but not indexed",
                }

        return {"error": f"Post with slug '{slug}' not found"}

    else:
        return {
            "error": f"Unknown action: {action}",
            "available": ["create", "list", "publish", "draft", "status", "unlisted"],
        }


if __name__ == "__main__":
    mcp.run()
```

---

## Skill Prose

```markdown
---
name: blog
description: Unified blog management - create, publish, share, review posts
---

# @blog

Unified interface for anupamchugh.github.io blog management.

## Quick Reference

| Command | What It Does |
|---------|--------------|
| `@blog create "Title"` | Create new draft post |
| `@blog list` | Show all posts |
| `@blog list drafts` | Show only drafts |
| `@blog publish <slug>` | Publish post (commit + push) |
| `@blog draft <slug>` | Unpublish post |
| `@blog unlisted <slug>` | Make visible but not indexed |
| `@blog status <slug>` | Show post metadata |

## Examples

### Create and publish a post
```
@blog create "Death by a Thousand If-Statements"
# Edit the file...
@blog publish death-by-a-thousand-if-statements
```

### Check what's in draft
```
@blog list drafts
```

### Share for review without publishing
```
@blog unlisted my-draft-post
# Share URL: https://anupamchugh.github.io/my-draft-post
# Not in index, not in RSS, but accessible
```

## Post States

| State | Behavior |
|-------|----------|
| Draft | `published: false` - Not deployed |
| Unlisted | `published: true, unlisted: true` - Deployed but hidden from index |
| Published | `published: true` - Fully public |

## Backing Tool

All commands route to `blog_action()` MCP tool.
```

---

## Migration Plan

### Deprecate Old Skills

| Old Skill | Migration |
|-----------|-----------|
| `blog` | Rename to `blog-legacy`, deprecate after 2 weeks |
| `quick-blog` | Absorbed into `@blog create` |
| `publish-journal` | Keep separate (different use case) |
| `sync-blogs` | Keep separate (batch operation) |
| `blog-this` | Absorbed into `@blog create` with context |
| `blog-analyzer` | Keep separate (analysis, not management) |

### Timeline

| Week | Action |
|------|--------|
| 1 | Implement Phase 1 (core actions) |
| 1 | Add deprecation warnings to old skills |
| 2 | Implement Phase 2 (sharing) |
| 3 | Implement Phase 3 (review integration) |
| 4 | Remove deprecated skills |

---

## Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Commands to publish | 4 (edit + commit + push + wait) | 1 (`@blog publish`) |
| Skills to remember | 6 | 1 |
| Share draft for review | Impossible | `@blog unlisted` |
| Time to create post | ~2 min (manual frontmatter) | ~10 sec |

---

## Next.js Changes Required

### Support `unlisted` frontmatter

**File:** `lib/content.ts`

```typescript
// Filter unlisted posts from index and RSS
export function getPublishedPosts() {
  return getAllPosts().filter(post =>
    post.published === true && post.unlisted !== true
  );
}

// Include unlisted posts for direct URL access
export function getPostBySlug(slug: string) {
  return getAllPosts().find(post => post.slug === slug);
}
```

**File:** `app/rss.xml/route.ts`

```typescript
// Exclude unlisted from RSS
const posts = getPublishedPosts(); // Already filters unlisted
```

---

## Open Questions

1. **Preview branches:** Use Vercel preview deployments or simpler `unlisted` approach?
   - **Recommendation:** Start with `unlisted`, add preview branches later if needed

2. **Review gate:** Require review before publish?
   - **Recommendation:** Optional, not enforced. Add `reviewed: true` field for tracking.

3. **Substack sync:** Auto-post to Substack when publishing?
   - **Recommendation:** Out of scope for v1. Add later as `@blog sync-substack`.

---

## References

- Blog repo: `~/Desktop/workspace/anupamchugh.github.io`
- Current CLAUDE.md: Lists `/blog-forge`, `/design-primitives`, `/blog-theme`
- Jesse Vincent pattern: One tool per domain
- Existing skills: `blog`, `quick-blog`, `publish-journal`, `sync-blogs`, `blog-this`

---

**Version:** 1.0
**Author:** Claude
**Last Updated:** 2026-02-03
