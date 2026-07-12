---
draft: true
title: "150 Posts, 7 Agents, One Week of HN Blogs"
date: '2026-04-01T18:00:00.000Z'
categories: [notes]
keywords: [ai, claude-code, agents, reading, curation, hn-blogs, rss, linkvault, workflow]
type: essay
published: false
---

I subscribe to [HN Blogs](https://hnblogs.substack.com/feed), a daily digest of blog posts that surfaced on Hacker News. It ships 15-40 links per day. That's 150+ posts per week.

Nobody reads 150 posts a week.

So I built a workflow.

---

## The Setup

Seven Claude agents, launched in parallel. One per day. Each agent:

1. Fetches the daily digest
2. Reads every blog post
3. Summarizes the key insight in 2-3 sentences
4. Visits the author's blog root
5. Discovers 2-3 other posts worth reading
6. Rates each post: bookmark-worthy or skip

Total wall-clock time: ~12 minutes. Total posts processed: 150. Total author blogs crawled: 100+.

Then a philosopher council — Yegge, Hashimoto, Jesse Vincent — reviews the top 15 and assigns verdicts: BUILD, BOOKMARK, SKIP, or STEAL THE PATTERN.

The best links get batch-saved to LinkVault. 87 bookmarks this week. All synced to my phone.

---

## What Survived the Filter

Out of 150 posts, here's what the agents and the council agreed matters:

### The Builders

**"Reliable Unreliability"** — David Gasquez argues you should stop trying to make AI components reliable. Instead, design the system around their unreliability. Pairwise voting, modular validation, retry layers. The same approach that made early computers work despite unreliable hardware.

**"From Error-Handling to Structured Concurrency"** — Nelson Elhage traces a line from single-threaded exceptions to Python's TaskGroup. When one concurrent task fails, cancel siblings and propagate upward. It mirrors how structured programming tamed goto.

**"The Contract in Every API Call"** — Shen Li says every API should require clients to declare their observed world state before executing irreversible operations. It's optimistic concurrency, reframed as a universal design principle.

### The Tools

**"Supercharging Claude Code with CLI Tools"** — Bozhidar Batsov curates 10 tools. The council narrowed it to three: `ast-grep` (structural code search), `difftastic` (syntax-aware diff), `shellcheck` (safety). Install these today.

**"Monitor Claude Code with Grafana"** — Claude Code natively supports OpenTelemetry. Set two env vars, point at a Grafana Alloy collector, get per-session token usage and cost_usd in dashboards.

**"Don't Wait for Claude"** — Jay McCarthy built a macOS app for parallel Claude sessions with externalized state. The pattern works without the app: a TODO.md per session with a WAIT marker. Three times more productive cycles per hour.

### The Warnings

**"The Comforting Lie of SHA Pinning"** — GitHub resolves SHAs against the entire Git object database, including forks. An attacker can substitute a valid SHA pointing to malicious code. Reviewers see no change in owner, repo, or tag.

**"Every Package You Install Can Read Your Secrets"** — npm/pip packages execute arbitrary code during installation with access to your .env, cloud creds, and CI secrets. The one-line defense: `minimumReleaseAge = 604800` (7 days).

**"Time to Treat Dev Machines as Untrusted"** — Remove sensitive credentials entirely. Use YubiKeys for commits. Keep release creds separate from dev environments. If attackers find nothing, the breach is inconsequential.

### The Frames

**"Tickets Are Prompts"** — Granular tickets are narrow prompts. Agents trained on atomized issues produce fragmented solutions at machine speed. The fix: outcome-shaped work, not technical sub-tasks.

**"Tell the Model What to Do, Not What to Avoid"** — "Use table-driven tests because they make adding cases trivial" beats "NEVER skip table-driven tests." The because-clause gives the model reasoning it can generalize.

**"Dashboards Are Already Dead"** — Dashboards present pre-answered questions nobody asked. The information retrieval layer — navigating to a screen, reading data, deciding — is the part that gets eaten by conversational AI.

---

## The Author Blogs Worth Following

The best discovery wasn't the posts — it was the blogs behind them.

- **hamel.dev** — LLM evals bible. Every post is actionable.
- **brooker.co.za** — Marc Brooker. AWS principal. Distributed systems depth.
- **blog.nelhage.com** — Systems programming, structured concurrency. Best technical writer working.
- **boringsql.com** — PostgreSQL internals. Consistently excellent.
- **chrisloy.dev** — AI coding judgment. Full 2025-2026 catalog.
- **blog.raed.dev** — Agent architecture. HITL critique trilogy.
- **blog.exe.dev** — Quadratic agent costs. Software factories.
- **glama.ai/blog** — MCP security series. Three posts, all urgent.
- **wespiser.com** — AI expansion vs software pruning. DNS complexity.
- **dheer.co** — Agent teams. Tickets as prompts.

---

## The Philosopher Council

I ran Yegge, Hashimoto, and Jesse on the top 15. Some highlights:

On **"Reliable Unreliability"**, Yegge said: *"This is the post that should be required reading for anyone building agents. The pairwise voting example is a genuine platform pattern — small, composable, reliable sub-agents aggregated into reliable systems. This will still be true in 5 years."*

On **"Error Messages for Agents"**, Hashimoto said: *"Before shipping any API, ask: what does an agent do when this call fails? That question surfaces every dark corner."*

On **"Positive Framing"**, Jesse said: *"This post argues that prose context beats declarative rules, which is the Jesse position exactly. You could just do one pass on your CLAUDE.md asking 'does each constraint explain why?' and get 80% of the value."*

---

## What This Becomes

This workflow — RSS ingest, parallel agent processing, scoring, author discovery, philosopher review, batch bookmarking — is the demo reel for an app.

**Sieve**: an iOS app using Apple's on-device Foundation Models. Zero API cost. Process overnight. Digest ready at coffee.

The scoring learns from what you bookmark and what you skip. The philosopher council runs on-device. Author discovery happens automatically.

RSS is old. On-device AI makes it new.

[Spec written. TestFlight coming.]

---

*87 bookmarks saved. 150 posts read. 100+ author blogs crawled. One Tuesday afternoon.*