---
title: "Check GitHub Issues Before Building"
date: '2026-02-01T18:00:00.000Z'
categories: [tools]
keywords: [claude-code, claudeignore, github]
slug: /check-github-issues-before-building
---

Claude Code 2.1.27 had a memory leak. I built a workaround. Four days later, [2.1.29 fixed it](https://status.claude.com/incidents/rl6pphjrc2r4).

## The Tool

`@declutter` generated `.claudeignore` files for large workspaces.

```bash
@declutter --fix    # Generate .claudeignore
```

Now archived: [github.com/anupamchugh/declutter](https://github.com/anupamchugh/declutter)

## `.claudeignore`

Works like `.gitignore`. Tells Claude Code which directories to skip:

```
node_modules/
.venv/
DerivedData/
*.log
```

Still useful for faster context gathering.

## Before Building a Workaround

1. Search GitHub issues
2. Check open PRs
3. Read the status page
4. Wait 48 hours

---

*The bug was fixed in 1 hour. I spent 4 days building around it.*
