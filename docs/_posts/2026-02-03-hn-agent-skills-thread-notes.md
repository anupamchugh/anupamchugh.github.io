---
draft: true
title: "agent skills are a temporary hack"
date: '2026-02-03T18:00:00.000Z'
categories: [agents, ai, tools]
keywords: [skills, context-window, agents, claude-code, temporary-hack]
slug: /agent-skills-are-a-temporary-hack
published: false
---

i have 42 skills in my claude code setup. authentication workflows, resource management, backend recovery procedures, data health checks, simulation control. each one is a markdown file with frontmatter, a description field, and prose instructions telling the agent how to handle a specific task type.

managing them is its own full-time job.

skills drift from reality within days. an authentication skill told the agent to target a CSS selector that didn't exist on the page — the site had reused a different element for its 2FA input. i only found the bug by comparing the claude code skill against the codex version, which someone had fixed independently. two copies of the same guidance, silently diverging, one of them wrong. multiply that by 42.

i've been thinking about whether the format survives. two recent HN threads — one on the [agent skills spec](https://news.ycombinator.com/item?id=46871173) (533 points) and one on [vercel's AGENTS.md evals](https://news.ycombinator.com/item?id=46809708) (520 points) — helped me articulate what i'd been circling around. both threads had pieces of the answer. neither had the whole picture.

## the budget problem

skills solve a real problem today: context budget management. with a 200k token window, you can't load everything your agent might need. 42 skills at ~300 tokens each for the discovery index is 12,600 tokens — manageable. loading all the underlying documentation those skills reference would be 10-20x that. progressive disclosure — load the name and description first, pull in the full instructions only when relevant — is a reasonable architecture for a constrained system.

i measured this on my own setup. my 42 skill descriptions total ~12,600 tokens in the system prompt. the full skill bodies, if loaded simultaneously, would be ~126,000 tokens. that's 63% of a 200k window consumed before the agent reads a single line of code. progressive disclosure isn't ceremony — it's survival.

## what vercel's eval actually showed

vercel ran evals comparing AGENTS.md against skills for teaching agents about Next.js 16 APIs. baseline with no docs: 53% pass rate. skills with default configuration: 53% — no improvement. skills with explicit invocation instructions: 79%. a single AGENTS.md file with compressed documentation: 100%.

the interesting part isn't just that one file beat many files. it's *how* they compressed. 40KB of documentation squeezed to 8KB using pipe-delimited formatting — barely readable to humans, but token-efficient for LLMs. the insight: the format that works best for agents isn't human-readable prose. it's compressed reference tables that minimize tokens while preserving lookup structure.

i tested this against my own skills. my `@backend-recovery` skill is 847 tokens of readable prose. i rewrote it as a pipe-delimited reference table: 312 tokens, same information. the agent followed both equally well. the readable version costs 2.7x more tokens for identical behavior. across 42 skills, that adds up.

## the fragmentation accelerator

there's another force pushing skills toward obsolescence that neither thread fully addressed: format fragmentation.

the skills spec defines a folder structure — `.claude/skills/` for claude code, `.codex/skills/` for codex. but opencode wants `.opencode/skills/`. github copilot wants `.github/copilot-instructions.md`. cursor wants `.cursor/rules/`. every tool reinvents the folder path, the frontmatter schema, the discovery mechanism.

i maintain skills across two runtimes today — claude code and codex. synchronizing 42 skills between `.claude/skills/` and `.codex/skills/` is a weekly chore. i built a sync tool for it. the sync tool itself has bugs. when a third runtime enters the picture, i'm maintaining three copies of the same guidance with three different folder conventions and three different frontmatter schemas. that doesn't scale. it barely works at two.

a single `AGENTS.md` file at the repo root works everywhere. no folder convention to match. no frontmatter schema to align. no sync tool to maintain. the format fragmentation makes skills more expensive over time, not less.

## the context window trajectory

context windows are expanding fast. claude went from 100k to 200k to 1M tokens in the span of a year. if that hits 10M — and the trajectory suggests it will — the discovery overhead that justifies skills disappears. you can load every piece of documentation your agent might need, all the time, passively. no two-phase loading. no index. no progressive disclosure.

the maintenance burden compounds this. every skill is a liability. it can drift from the codebase it describes. it can conflict with other skills. it can encode stale selectors, wrong API endpoints, outdated parameters. i spent more time debugging skill drift last week than i spent on actual feature work.

## but skills encode something docs don't

here's the counterargument i keep coming back to: my best skills aren't documentation. they're judgment.

one of my workflow skills doesn't just list API endpoints. it encodes a sequence: validate inputs first, then check resource limits, then size the operation, then execute, then monitor, then report. it knows that you never skip validation even if the user says "just do it." it knows that different operation types need different sizing rules. it knows to check if the backend is running before attempting anything.

that's not information retrieval. that's opinionated workflow guidance — the kind of thing a senior engineer would tell you on your first day. "here's how we do it, here's why, here's what you never skip."

you could put all of that in AGENTS.md. but AGENTS.md is one file serving every possible task. a skill is scoped to one task type, which means it can be maximally opinionated about that task without polluting the guidance for every other task.

even with infinite context, there's a difference between "here is everything about this codebase" and "for this specific task, here is exactly what to do." the former requires the agent to extract the relevant subset. the latter hands it over pre-filtered.

## what survives

the format dies. the intent survives.

nobody will be writing `SKILL.md` files with YAML frontmatter in two years. the progressive disclosure mechanism — load index, then load payload — becomes unnecessary as context windows grow. the folder conventions that already fragment across tools will fragment further until nobody bothers synchronizing them.

but the thing skills *encode* — opinionated, task-scoped guidance that tells an agent not just what tools exist but how to use them together, in what order, with what safety checks — that need doesn't go away. it just gets embedded differently. maybe it's tagged sections in AGENTS.md. maybe it's compressed reference tables optimized for LLM consumption. maybe it's structured comments in the code itself.

the container changes. the content — expert judgment scoped to a specific task — persists.

## what this means if you're building agent tooling today

build for the constraint that exists now, but don't over-invest in the format.

three things i'd do differently knowing what i know:

1. **compress aggressively.** pipe-delimited reference tables over readable prose. your agent doesn't care about readability. save the tokens for code.

2. **write AGENTS.md first, skills second.** put the critical judgment in one file that works everywhere. only split into skills when one file genuinely can't fit in context.

3. **treat the format as disposable and the judgment as durable.** the sentence that says "never skip input validation before execution" or "always verify the backend is healthy before calling any API" — that's the asset. capture it somewhere portable. don't couple it to a discovery mechanism that's one context-window expansion away from irrelevance.

the real question isn't skills vs. AGENTS.md. it's: how do you encode expert judgment so agents can use it reliably, regardless of how context management evolves? skills are one answer. they won't be the last.

---

*references: [agent skills thread](https://news.ycombinator.com/item?id=46871173) (533 pts) — [vercel AGENTS.md evals](https://news.ycombinator.com/item?id=46809708) (520 pts) — [agent skills spec](https://agentskills.io/what-are-skills)*
