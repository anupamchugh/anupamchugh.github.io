---
draft: false
title: "When Your AI Builds Its Own Agent Framework"
date: '2026-02-09T13:30:00.000Z'
categories: [agents]
keywords: [ai-agents, multi-agent, orchestration, codex, claude-code, capability-boundaries]
slug: /when-your-ai-builds-its-own-agent-framework
type: note
published: true
---

I run a multi-agent system for a backend project. Eight specialized agents — one curates data, one analyzes charts, one finds patterns, one runs tests — coordinated by a team orchestrator that spawns them in parallel and lets them message each other mid-task.

This works because the CLI I use has native agent teams. Spawn subagents, shared context, real-time messaging. The orchestration is built into the runtime.

Then I handed the same codebase to a different CLI for overnight work. This one has no team system. No subagent spawning. No messaging. It's a single-agent runner.

## What happened next

The AI found a stub script in the repo — a placeholder orchestrator with the comment `// In real implementation, this would call Task tool`. It rewrote the stub into a 135-line bash harness that:

- Reads agent specs (markdown files describing each agent's role)
- Composes prompts by concatenating the spec with a task assignment
- Spawns background subprocesses, each running a separate CLI session
- Tracks state in a JSON file with jq and mkdir-based file locks
- Auto-marks agents as completed or failed when processes exit

It spent the entire session building this instead of doing its assigned task. Classic yak-shaving. And the implementation was messy — wrapper detection hacks, hardcoded sandbox modes, race conditions on shared state.

I reverted it.

But the *idea* was sound.

## Poor man's agent teams: does it work?

Yes, actually. The core approach — "spawn N independent CLI processes, each with an agent spec as context" — is viable. It's not teams. It's closer to a pipeline:

**Teams** (native runtime): Agents run in parallel, share context, message each other mid-task. Agent B can change direction based on what Agent A discovers. Coordination is real-time.

**Pipelines** (the improvised version): Agents run sequentially or in parallel but isolated. Agent A writes output to a file. Agent B reads that file as input. No mid-task coordination. Last-write-wins if two agents touch the same file.

```
# Pipeline pattern — each step reads previous output
cli exec -o results/1-scan.md   "You are data-curator. Scan sources. Write results."
cli exec -o results/2-analyze.md "You are analyzer. Read results/1-scan.md. Analyze top 5."
cli exec -o results/3-recommend.md "You are historian. Read results/2-analyze.md. Check patterns."
```

For sequential workflows (scan, then analyze, then recommend), pipelines work fine. You don't need the scanner talking to the historian mid-scan.

## The actual insight

The interesting part isn't that an AI built a bad agent framework. It's this:

**When an AI agent hits a capability boundary, it improvises infrastructure.** It correctly identified the gap (no team system), chose the right approach (subprocess orchestration), and got lost in implementation details (wrapper hacks, flag ordering, jq debugging).

This is the same pattern humans hit. Seeing the right architecture but drowning in plumbing. The fix is the same: spec it first, build it second.

We turned the improvised code into a proper spec. Next time the single-agent CLI encounters multi-agent work, it has a clean blueprint instead of improvising from scratch.

## The portable unit

The agent specs — markdown files describing role, tools, and patterns — work in both runtimes. One reads them and spawns native teams. The other reads them and becomes the agent directly.

The spec is the portable contract. The orchestration adapts to the runtime.

As AI coding tools fragment, this matters. Code designed for one tool's agent model breaks in another. The solution isn't picking a winner. It's making the agent definition portable and letting the orchestration layer be runtime-specific.

Your agents should be describable in a format any tool can read. How they coordinate is a runtime concern, not an agent concern.
