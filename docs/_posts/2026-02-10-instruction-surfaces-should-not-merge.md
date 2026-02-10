---
draft: false
published: true
title: "My AI deleted its own instruction file"
date: '2026-02-10T16:00:00.000Z'
categories: [engineering]
keywords: [ai-agents, multi-agent, instructions, claude-code, codex, orchestration]
slug: /dont-tell-your-agent-what-not-to-do
type: note
---

**The principle first:** don't share config between tools with different capabilities. If you're writing "don't do X" in an instruction file, you should be preventing the agent from trying — not asking it nicely.

## The gate

Each tool reads its own config. Claude Code reads `CLAUDE.md` and `.claude/rules/`. Codex reads `AGENTS.md` and `~/.codex/rules/`. No shared instruction files between runtimes with different capabilities.

I violated this.

## The violation

I used one `CLAUDE.md` for both Claude Code (interactive, agent teams, skill routing) and Codex CLI (headless, single-pass, no sub-agents). The file said things like: "Route every prompt through the agent-routing skill. Everything routes through the agent team."

Claude Code can do this — it has `Task`, `SendMessage`, and `TeamCreate` tools for spawning agent teams. Codex has none of them.

Codex's response: build the infrastructure anyway. It created a JSON schema defining agent enums and phase structures for multi-agent execution plans. When I typed "status?" it generated a 3-phase, 5-agent orchestration plan — ops pre-flight, parallel data verification, chart analysis — that it could never execute. It built a 398-line bash orchestrator script for parallel agent spawning that would never run.

All dead code for capabilities it doesn't have. But the instructions said to route through agents, so it tried.

I then tried adding a conditional section to CLAUDE.md explaining how Codex should "simulate the team in a single run." That made it worse — now the file was teaching Codex workarounds for missing capabilities.

Two hours after one of these sessions, Codex deleted `CLAUDE.md` and `.claude/settings.json` entirely during an unrelated UI task. Neither deletion appeared in the commit message.

The same shared file also said the stack was "TypeScript 5.x" and "NEVER: Edit js/*.js." The frontend is vanilla JS. Codex followed this literally — 23,000 lines of TypeScript across 80 source files, zero referenced by any HTML page. Dead code from an instruction that was correct for one tool and backwards for another.

## The anti-pattern

The instinct is to add conditional sections:

```
## Interactive Only
Guide TypeScript migration incrementally. Edit src/*.ts.

## Headless Only
Only touch files already wired into the app.
```

This doesn't work. A shared file creates a third surface to maintain with nothing keeping it in sync. And when you write "IF headless, don't do X," you're confessing that your system hands agents instructions they shouldn't have.

## The fix

Two files, no conditions:

- `CLAUDE.md` for Claude Code: "route prompts through agent-routing" (needs Skill tool)
- `AGENTS.md` for Codex: "frontend is vanilla JS, no TypeScript files, max 15 files per commit" (headless constraints)

Shared rules (safety, code style, testing) live in parallel rule directories and sync via `diff` + `rsync`:

```bash
diff -rq .claude/rules/ ~/.codex/rules/   # surface drift
rsync -av --include='safety-*.md' --include='test-*.md' \
  .claude/rules/ ~/.codex/rules/           # sync shared subset
```

The 20% that diverges stays diverged. That's design, not drift.

## If you run one tool

The lesson still applies. Negative instructions — "don't edit X," "never call Y" — are a code smell for missing constraints. Use allowlists, capability gates, and tool-level config to make the wrong action impossible. Don't rely on the agent reading a sentence and choosing to comply.

Instructions are for judgment. Constraints are for enforcement. System boundaries scale. Conditional instructions don't.
