# Content Guard Creative Auto-Suggest Spec

**Status:** Todo (Next Session)
**Created:** 2026-02-03
**Category:** Developer Tooling / Blog Publishing
**Priority:** P2

---

## Problem

Content-guard blocks names and framework terms but just says "BLOCKED". User has to manually think of pseudonyms/analogies.

**Current behavior:**
```
❌ BLOCKED: Name references
Line 24: "Steve Yegge's framework"

Run with --allow to bypass
```

**Desired behavior:**
```
⚠️ Line 24: "Steve Yegge's framework"

   Suggested analogies:
   1. "The Survivalist philosophy" (ecology theme)
   2. "The Longevity framework" (time theme)
   3. "The Darwinist approach" (evolution theme)

   Auto-fix? [1/2/3/skip]
```

---

## Solution: LLM-Powered Creative Suggest

### Architecture

```
content-guard check --suggest post.md
         │
         ▼
┌─────────────────────────┐
│  Detect blocked terms   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  For each blocked term: │
│  Call LLM with context  │
│  "Suggest 3 analogies   │
│   for '{term}' that     │
│   preserve meaning but  │
│   anonymize the source" │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Present suggestions    │
│  Allow selection        │
│  Apply replacement      │
└─────────────────────────┘
```

### Implementation Options

| Approach | Pros | Cons |
|----------|------|------|
| **MCP tool** | Integrated, can use any LLM | Needs backend |
| **Direct CLI** | Simple, uses `claude` or `gemini` CLI | External dep |
| **Skill + Claude** | Natural, already in Claude context | Only works in Claude |

**Recommendation:** Skill that Claude executes when content-guard blocks. No new code needed.

---

## Proposed Skill: `@content-guard-suggest`

```markdown
---
name: content-guard-suggest
description: When content-guard blocks a post, brainstorm creative pseudonyms and analogies
triggers:
  - "content guard blocked"
  - "suggest pseudonyms"
  - "anonymize this post"
---

## When Blocked

If content-guard blocks names or framework terms, **brainstorm** (don't lookup):

### Process
1. Read the blocked term IN CONTEXT (surrounding sentences matter)
2. Pick a theme that fits the post's tone (ecology, physics, mythology, etc.)
3. Generate 3 novel analogies that preserve meaning
4. Present options, let user choose

### Example Brainstorm

**Input:** "Steve Yegge's survival framework says tools must reduce friction"

**Context analysis:** Post is about tool longevity, natural selection of software

**Theme selected:** Ecology 🌿 (fits the survival metaphor)

**Brainstormed ideas:**
1. "The Survivalist philosophy" — persona that embodies the idea
2. "The Natural Selection approach" — the process itself
3. "The Darwinian framework" — scientific framing

**NOT a lookup table.** Each brainstorm is fresh, contextual, creative.

### Output Format
Present 3 options per blocked term, let user choose, apply replacements.
```

---

## Integration with Unified Blog System

Add to `@blog` skill from `UNIFIED_BLOG_PUBLISHING_SYSTEM_SPEC.md`:

```
@blog polish <slug>           # Elements of Style pass
@blog anonymize <slug>        # Content-guard + creative suggest
@blog publish <slug>          # Runs anonymize first if needed
```

---

## Example Session

```
$ @blog anonymize my-post

Scanning my-post.md...

❌ Blocked: "Yegge's survival framework" (line 24)

   Theme: Ecology 🌿
   1. "The Survivalist philosophy"
   2. "The Longevity framework"
   3. "The Natural Selection approach"

   Choose [1-3] or 'new' for different theme: 1

❌ Blocked: "beads_rust" (line 47)

   1. "my task tracker"
   2. "the work tracker"
   3. "the issue system"

   Choose [1-3]: 2

✅ Applied 2 replacements
   Run `@blog publish my-post` when ready
```

---

## Why Brainstorming, Not Mapping

**Mapping (BAD):**
```yaml
yegge: "The Survivalist"  # Static lookup, brittle, doesn't scale
```

**Brainstorming (GOOD):**
```
Given: "Yegge's survival framework" + context of your post
Generate: 3 novel analogies that fit the post's tone and theme
```

| Approach | Scales? | Creative? | Context-aware? |
|----------|---------|-----------|----------------|
| Mapping (lookup) | ❌ Manual entry | ❌ Just copying | ❌ Same output always |
| Brainstorming (LLM) | ✅ Any term | ✅ Novel ideas | ✅ Adapts to post tone |

**Key insight:** Static mappings are just find-replace with extra steps. LLM brainstorming understands context and generates ideas that fit YOUR specific post.

---

## Dependencies

- Content-guard bash script (exists)
- Unified blog spec (created this session)
- LLM access for creative suggestions

---

## Effort

| Task | Effort |
|------|--------|
| Skill prose (brainstorm prompts) | 30m |
| Integration with @blog | 30m |
| **Total** | 1h |

---

## Session Context

This spec emerged from committing "The Gauntlet" blog post:
- Content-guard blocked Yegge, Jesse, Dicklesworthstone names
- Manually created ecology analogies: Survivalist, Minimalist, Archivist
- User requested auto-suggest that *brainstorms* not just lookups

**Key insight:** Mapping = copying. Brainstorming = creating. LLMs should generate novel ideas based on context, not regurgitate from a lookup table. The suggestions should be creative and offer multiple themes (ecology, physics, mythology) so the writing feels natural, not find-replaced.

---

**Version:** 1.0
**Author:** Claude
**Last Updated:** 2026-02-03
