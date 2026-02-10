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

I run Claude Code and Codex CLI on the same codebase. Claude Code is interactive — I'm present, we iterate. Codex is headless — I delegate overnight and review in the morning. Both spawn sub-agents with limited tool access.

Last week Codex ran overnight and generated 23,000 lines of TypeScript. It was following a skill that says "edit src/*.ts files ONLY, never js/*.js (legacy)." That rule exists because I'm migrating from vanilla JS to TypeScript incrementally, and in Claude Code's interactive context, it works — I guide which files to touch and verify the build pipeline.

Codex, running headless, followed the instruction literally. It created 80 TypeScript source files with imports from `@/socket/SocketClient` and a full module system. The problem: every HTML page in the app loads from `js/`, not `dist/`. Zero pages reference the compiled output. Twenty-three thousand lines of dead code, generated in good faith.

**The instruction was correct for one tool and wrong for another.**

**The natural fix that doesn't work**

The instinct is to add conditional sections:

```
## All Agents
Use absolute paths. Run tests before committing.

## Interactive Only
Guide TypeScript migration incrementally. Edit src/*.ts.

## Headless Only
Only touch files that are already wired into the app. No speculative migrations.
```

I tried this. It doesn't work. Here's why.

**Surface problem: shared files drift and die**

My Claude Code config has 58 granular rule files. Codex has 62. They overlap 80%. The 20% difference is load-bearing — it reflects genuinely different execution contexts. A shared file creates a third surface to maintain. No enforcement keeps them in sync. Within weeks it becomes cargo cult documentation.

**Deeper problem: instructions are doing access control's job**

When I wrote "Sub-agent: do NOT invoke skills," I was documenting a system failure. The sub-agent tries to invoke skills because it reads rules that reference skills. When I wrote "headless: don't migrate speculatively," I was patching an instruction that shouldn't have reached Codex in the first place.

This is the pattern: when you write "IF role X, don't do Y," you're confessing that your system hands agents capabilities or instructions they shouldn't have.

**What actually works**

Tool-specific instruction files with a sync mechanism.

- `.claude/rules/` for Claude Code (58 files, auto-loaded)
- `~/.codex/rules/` for Codex CLI (62 files, separate location)
- `.cursorrules` for Cursor
- `.github/copilot-instructions.md` for Copilot

Each natively loaded by its tool. Shared rules (safety constraints, code style, testing) synced by a diff-and-reconcile mechanism. The 20% that diverges is allowed to diverge — that's not drift, that's design.

The TypeScript migration skill stays in `.claude/rules/` where it belongs. Codex never sees it. No conditional branching needed. No 23K lines of dead code.

For sub-agents: the orchestrator filters context before delegation. The runtime enforces tool boundaries. Instructions handle the irreducible semantic core — judgment calls only a model can make.

**The principle**

Instructions are for judgment. Constraints are for enforcement. If you're telling the agent what not to do, you should be preventing it from trying.

Conditional instructions don't scale. System boundaries do.
