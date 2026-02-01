---
title: "I Built a Tool That Became Obsolete in Four Days"
date: '2026-02-01T18:00:00.000Z'
categories: [satire, tools]
keywords: [declutter, claude-code, claudeignore, indie-dev]
slug: /i-built-a-tool-that-became-obsolete-in-four-days
---

Claude Code froze on my workspace. Too many log files, too much node_modules bloat.

I built a tool to fix it. Four days later, the problem was [fixed upstream](https://status.claude.com/incidents/rl6pphjrc2r4).

## What I Built

`@declutter` scanned workspaces and generated `.claudeignore` files—the ignore file that tells Claude Code which directories to skip.

```bash
@declutter              # Scan, show bloat
@declutter --fix        # Generate .claudeignore
```

It worked. Tests passed. README written. Repo published.

## What Happened

Anthropic fixed the memory leak in version 2.1.29. One hour to fix what I spent four days building around.

The tool is now [archived on GitHub](https://github.com/anupamchugh/declutter).

## The `.claudeignore` File

The useful part: `.claudeignore` works like `.gitignore`. Add patterns for directories Claude Code should skip:

```
# .claudeignore
node_modules/
.venv/
DerivedData/
*.log
```

This still helps with large workspaces—not for memory, but for faster context gathering.

## Pivot Ideas

If you want to build something in this space, consider:

- **Token budget calculator** — Show context cost per directory for any LLM tool
- **Universal ignore generator** — One command to create ignores for git, docker, Claude, Cursor, Copilot

These solve broader problems than "Claude freezes on big folders."

## The Lesson

Check if a fix is coming before building a workaround. Search GitHub issues. Read the status page. Wait 48 hours.

Build tools that solve permanent problems, not temporary bugs.

---

*[github.com/anupamchugh/declutter](https://github.com/anupamchugh/declutter) — archived*
