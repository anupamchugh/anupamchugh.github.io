---
draft: false
published: true
title: "Shared instruction files are the env vars of AI agents"
date: '2026-02-10T16:00:00.000Z'
categories: [engineering]
keywords: [ai-agents, multi-agent, instructions, claude-code, codex, orchestration]
slug: /dont-tell-your-agent-what-not-to-do
type: note
---

**The principle first:** don't share config between tools with different capabilities. If you're writing "don't do X" in an instruction file, you should be preventing the agent from trying — not asking it nicely.

Every developer has debugged an env var that was right in staging and wrong in prod. Same variable name, two systems that needed different values. Shared instruction files are the same class of bug — except env vars crash when misconfigured. Instruction files build dead infrastructure in good faith.

## The gate

Each tool reads its own config. Claude Code reads `CLAUDE.md` and `.claude/rules/`. Codex reads `AGENTS.md` and `~/.codex/rules/`. No shared instruction files between runtimes with different capabilities.

Think of it like `.env.staging` and `.env.production`. Same keys where appropriate, different values where the systems diverge. You wouldn't point staging and production at the same `.env` and add `IF production, don't use the test database`. You'd have two files.

I violated this.

## The violation

I used one `CLAUDE.md` for both Claude Code (interactive, agent teams, skill routing) and Codex CLI (headless, single-pass, no sub-agents). The file contained routing directives: "Route every prompt through the agent-routing skill. Everything routes through the agent team."

Claude Code can do this — it has `Task`, `SendMessage`, and `TeamCreate` tools for spawning agent teams. Codex has none of them.

Codex's response: build the infrastructure anyway. It created a JSON schema defining agent enums and phase structures for multi-agent execution plans. When I typed "status?" it generated a 3-phase, 5-agent orchestration plan — ops pre-flight, parallel data verification, chart analysis — that it cannot execute. It built a 398-line bash orchestrator script for parallel agent spawning that would never run.

All dead code for capabilities it doesn't have. But the instructions said to route through agents, so it tried. An env var pointing at the wrong database gives you a connection error. An instruction file pointing at wrong capabilities gives you 23,000 lines of dead TypeScript.

I then tried adding a conditional section to CLAUDE.md explaining how Codex should "simulate the team in a single run." That made it worse — now the file taught Codex workarounds for missing capabilities.

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

This fails. A shared file creates a third surface to maintain with no sync mechanism. Writing "IF headless, don't do X" confesses that your system hands agents instructions they shouldn't have. It's the equivalent of `if os.environ["ENV"] == "production": dont_use_test_db()` — a runtime check for something that should never be possible.

## The fix

Two files, no conditions. Scope per tool, the way you scope per environment:

- `CLAUDE.md` for Claude Code: "route prompts through agent-routing" (needs Skill tool)
- `AGENTS.md` for Codex: "frontend is vanilla JS, no TypeScript files, max 15 files per commit" (headless constraints)

Shared rules (safety, code style, testing) live in parallel rule directories and sync via `diff` + `rsync`:

```bash
diff -rq .claude/rules/ ~/.codex/rules/   # surface drift
rsync -av --include='safety-*.md' --include='test-*.md' \
  .claude/rules/ ~/.codex/rules/           # sync shared subset
```

The shared subset syncs. Agent-spawn capabilities diverge. Design, not drift.

## If you run one tool

The lesson still applies. Negative instructions — "don't edit X," "never call Y" — are a code smell for missing constraints. Use allowlists, capability gates, and tool-level config to make the wrong action impossible. Don't rely on the agent reading a sentence and choosing to comply.

Instructions are for judgment. Constraints are for enforcement. Env vars taught us to scope config per environment. Instruction files need the same discipline — scope per tool, or watch your agent build infrastructure it cannot use.
