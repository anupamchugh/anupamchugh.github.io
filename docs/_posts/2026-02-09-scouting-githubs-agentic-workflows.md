---
title: "Scouting GitHub's agentic workflows: what agents forget about their own logs"
date: '2026-02-09T15:00:00.000Z'
categories: [open-source]
keywords: [open-source, github, agentic-workflows, log-compaction, token-efficiency]
slug: /scouting-githubs-agentic-workflows
type: note
published: true
---

GitHub released [gh-aw](https://github.com/github/gh-aw) this week — an official framework for writing GitHub Actions workflows in natural language. Agents compile markdown into YAML, then execute. 233 points on HN, 116 comments, mostly about the security model.

Nobody was talking about the token bill.

Their audit workflows read 24 hours of logs daily for trend analysis. Each workflow run produces tens of thousands of tokens of execution traces. Multiply by hundreds of runs, and historical analysis over 30 days becomes expensive fast.

**The insight:** agents learning from past failures don't need full execution logs. They need structured error patterns — status, key errors, token count, a one-line summary. A 45K-token workflow log compacts to ~200 tokens without losing diagnostic value.

This is a pattern I use in a project that archives specs and issue trackers. When the archive grows past a threshold, old entries get compacted into structured summaries. Active entries stay full. The archive is still searchable, but 80-90% smaller. Same principle applies to agent workflow logs.

I [opened an RFC](https://github.com/github/gh-aw/issues/14603) proposing a `compact_after: 7d` setting — keep raw logs for a week, then replace with summaries. The team already has [four open issues](https://github.com/github/gh-aw/issues?q=is%3Aissue+is%3Aopen+token) about token optimization, so the appetite is there.

**The meta-lesson:** agents are good at optimizing the code they generate. They're less good at optimizing their own operational footprint. Log compaction is the kind of infrastructure that doesn't emerge from "make this workflow better" — it emerges from asking "why is analyzing old workflows so expensive?"

---

*[RFC #14603](https://github.com/github/gh-aw/issues/14603) open for discussion.*
