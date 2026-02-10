---
draft: false
published: true
title: "Don't tell your agent what not to do"
date: '2026-02-10T16:00:00.000Z'
categories: [engineering]
keywords: [ai-agents, multi-agent, instructions, claude-code, codex, orchestration]
slug: /dont-tell-your-agent-what-not-to-do
type: note
---

I run Claude Code and Codex CLI on the same codebase. Claude Code is interactive — I'm present, we iterate. Codex runs headless — I delegate overnight and review in the morning.

Both tools read `CLAUDE.md` at the project root. One file, two runtimes with different capabilities. This broke in ways I didn't expect.

**What CLAUDE.md told Codex to do**

My `CLAUDE.md` said: "Route every prompt through the agent-routing skill. Everything routes through the trading agent team." These instructions work in Claude Code, which has `Task`, `SendMessage`, and `TeamCreate` tools for spawning agent teams.

Codex has none of these. It runs single-pass, no sub-agents, no team primitives. But it read the same file.

Codex's response: build the infrastructure to make it work. It created a 59-line JSON schema defining agent enums, phases, and task structures for "trading team plans." It wrote a conditional section *into CLAUDE.md itself* explaining how to "simulate the team in a single run by reading agent spec files and executing modes sequentially." It archived a 398-line bash swarm orchestrator with heartbeat monitoring and auto-recovery.

All dead code. Codex can't run parallel agents. But the instructions told it to, so it tried.

Two hours later, doing an unrelated board UI task, Codex deleted `CLAUDE.md` and `.claude/settings.json` entirely. Neither deletion appeared in the commit message. The file that tried to serve two masters ended up serving neither.

**The cascading damage**

The same shared file also said the stack was "TypeScript 5.x" and the boundary rules said "NEVER: Edit js/*.js." The frontend is actually vanilla JS — every HTML page loads from `js/`, not `dist/`. That rule exists for Claude Code's incremental migration workflow, where I guide which files to touch.

Codex followed the instruction literally. It generated 23,000 lines of TypeScript across 80 source files with imports from `@/socket/SocketClient` and a full module system. Zero pages reference the compiled output. Dead code, generated in good faith, from an instruction that was correct for one tool and backwards for another.

**The natural fix that doesn't work**

The instinct is to add conditional sections:

```
## Interactive Only
Guide TypeScript migration incrementally. Edit src/*.ts.

## Headless Only
Only touch files already wired into the app.
```

This is what Codex itself tried — it wrote the conditional section. It doesn't work.

A shared file creates a third surface to maintain. Nothing keeps it in sync. Within weeks it becomes cargo cult documentation. Worse: when you write "IF headless, don't do X," you're confessing that your system hands agents instructions they shouldn't have. The instruction shouldn't reach them in the first place.

**What works instead**

Tool-specific instruction files with a sync mechanism.

- `CLAUDE.md` for Claude Code: "route every prompt through agent-routing" (requires Skill tool)
- `AGENTS.md` for Codex: "frontend is vanilla JS, do not create TypeScript files, max 15 files per commit, stage files by name" (headless-specific constraints)
- `.claude/rules/` (58 files, auto-loaded by Claude Code)
- `~/.codex/rules/` (62 files, loaded by Codex)

Each natively loaded by its tool. Shared rules — safety constraints, code style, testing — synced by a diff-and-reconcile mechanism. The 20% that diverges stays diverged. That's design, not drift.

The TypeScript migration skill stays in `.claude/rules/` where it belongs. Codex never sees it. No conditional branching. No 23K lines of dead code. No 59-line JSON schemas for capabilities that don't exist.

**The principle**

Instructions are for judgment. Constraints are for enforcement. If you're telling the agent what not to do, you should be preventing it from trying.

Conditional instructions don't scale. System boundaries do.
