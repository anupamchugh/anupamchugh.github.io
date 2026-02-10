---
draft: false
title: "My workspace is an operating system"
date: '2026-02-09T18:00:00.000Z'
categories: [agents, workflow]
keywords: [workspace, operating-system, mcp, skills, agents, agentic-workflows, drift-detection]
slug: /my-workspace-is-an-operating-system
type: note
published: true
---

Hacker News had a thread about ["Company as Code"](https://news.ycombinator.com/item?id=46899132) — the idea that an entire company can be described declaratively. I've been living something smaller but structurally identical: my dev workspace is an operating system.

Not metaphorically. Structurally.

| OS concept | my workspace |
|---|---|
| kernel | Claude Code runtime |
| system calls | MCP tool invocations |
| device drivers | 10 MCP servers (each connects to a different system — exchange APIs, browser automation, Apple docs, issue tracking) |
| shell | 200+ skills — prose runbooks that compose system calls |
| processes | agent teams spawned via Task(), die after work |
| IPC | agent-mail — SQLite message broker with heartbeat and threading |
| filesystem | WORKSPACE.yaml manifest + memory files + project dirs |
| init config | CLAUDE.md + 7 rule files, loaded every session |
| daemons | background schedulers and autonomous loops that run 24/7 |

What makes it *agentic* and not just an OS:

**Self-healing.** [Wobble](https://news.ycombinator.com/item?id=46902789) detects skill drift using a bias/variance framework. Skills get a combined risk score: structural analysis (missing defaults, ambiguous steps) + behavioral analysis (variance across simulated runs). Score > 0.5 = unstable. Fix it before it breaks a workflow.

**Self-documenting.** Session-sage extracts lessons from raw session logs with 1–5 confidence scores and writes them back to memory files. Next session, the agent reads curated context instead of starting cold.

**Intent-driven.** Skills match on their description field, not slash commands. Say "track an order" and the system finds the skill. The runtime routes by intent, not by explicit invocation.

**Composable intelligence.** MCP servers chain: hn-research feeds rss-vault feeds the blog pipeline feeds linkvault feeds my phone. A multi-daemon backend runs 5 background schedulers and 6 autonomous loops — scanners, health monitors, sync daemons — all wired into startup/shutdown lifecycle events.

The biggest gap: no cron, no priority scheduler, no garbage collection. 30+ projects sit at `status: new` like zombie processes. RSS refresh, workspace scans, and memory compaction happen ad-hoc. The next step is making the OS *schedule itself* — not just respond to intent, but anticipate it.

Your workspace probably has the same bones. It just doesn't have a manifest yet.
