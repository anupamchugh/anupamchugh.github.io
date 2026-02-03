---
published: true
title: "Check GitHub Issues Before Building"
date: '2026-02-01T18:00:00.000Z'
categories: [tools]
keywords: [claude-code, github]
slug: /check-github-issues-before-building
---
published: true

My M4 Mac was eating battery faster than a cryptocurrency miner at a free electricity convention. Terminal kept freezing. Fans spinning.

I assumed it was workspace bloat. Built a tool. Four days later, found the [actual cause](https://github.com/anthropics/claude-code/issues/22042): corrupted session files from a hook bug in 2.1.27.

The fix was to delete some JSONL files. Or just update to 2.1.29.

## The Tool I Built

`@declutter` scanned workspaces for bloat. Turns out the problem wasn't bloat at all.

Now archived: [github.com/anupamchugh/declutter](https://github.com/anupamchugh/declutter)

## Before Building a Workaround

1. Search GitHub issues
2. Check open PRs
3. Read the status page
4. Wait 48 hours

---
published: true

*The bug was fixed in [1 hour](https://status.claude.com/incidents/rl6pphjrc2r4). I spent 4 days building around a misdiagnosis.*
