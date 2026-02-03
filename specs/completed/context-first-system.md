---
title: Context-First System
status: completed
priority: P0
created: 2026-02-01
completed: 2026-02-01
origin: context-location-failure (searched wrong blog)
---

# Context-First System

Prevent "which blog?" failures by checking context before searching.

## Problem

User said "check the blog design primitive work" → Claude searched `blogging/` instead of `anupamchugh.github.io/` because grep found it first alphabetically.

## Solution

Check context in this order:
1. Breadcrumb (`~/.claude/last-session.json`)
2. Aliases (`~/.claude/workspace-aliases.json`)
3. Recent git activity
4. THEN grep/glob (only if needed)

## Implemented

### Files Created

| File | Purpose |
|------|---------|
| `~/.claude/last-session.json` | Breadcrumb from last session |
| `~/.claude/workspace-aliases.json` | User's project aliases |
| `~/.claude/sessions/` | Historical breadcrumbs |
| `~/.claude/rules/context-first.md` | Enforcement rule |

### Skills Updated

| Skill | Change |
|-------|--------|
| `session-journal` | Writes breadcrumb at session end |
| `session-recovery` | Reads breadcrumb + aliases + git first |
| `workspace-memory` | Find/alias/recent/context actions |

### Project Identity Added

| Project | CLAUDE.md |
|---------|-----------|
| `anupamchugh.github.io` | Added Project Identity section |
| `blogging` | Added Project Identity section |

## Yegge Analysis

| Before | After |
|--------|-------|
| LLM guesses project | Static JSON lookup |
| Grep across 50 repos | Direct path from alias |
| 2 corrections needed | 0 corrections |

**Survival Ratio:** > 1.0 (substrate beats inference)

## Related

- Journal: `shadowbook-local/entries/2026-02-01-context-location-failure.md`
- Next: `specs/active/design-primitives-mvp.md`
