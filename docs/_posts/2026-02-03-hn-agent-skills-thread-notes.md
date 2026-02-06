---
draft: false
title: "agent skills are a temporary hack"
date: '2026-02-03T18:00:00.000Z'
categories: [agents, ai, tools]
keywords: [skills, context-window, agents, claude-code, temporary-hack, hn]
slug: /agent-skills-are-a-temporary-hack
published: true
---

i have 42 skills in my claude code setup. watchlist management, order placement workflows, backend recovery procedures, data health checks, paper trading simulation control. each one is a markdown file with frontmatter, a description field, and prose instructions telling the agent how to handle a specific task type.

managing them is its own full-time job.

skills drift from reality within days. the kite login skill said to use a `#totp` selector that didn't exist — the working version used `#userid` because kite reuses that element on the 2FA page. i only found the bug by comparing the claude code skill against the codex skill, which someone had fixed independently. two copies of the same guidance, silently diverging, one of them wrong. multiply that by 42.

an [HN thread](https://news.ycombinator.com/item?id=46871173) crystallized something i'd been circling around. the debate was about whether the [agent skills format](https://agentskills.io/what-are-skills) — the `SKILL.md` standard with frontmatter and progressive disclosure — is genuinely useful or just unnecessary process. both sides had it partly right, and the resolution points somewhere neither camp was looking.

## what the pragmatists got right

skills solve a real problem today: context budget management. with a 200k token window, you can't load everything your agent might need. 42 skills at ~300 tokens each for the discovery index is 12,600 tokens — manageable. loading all the underlying documentation those skills reference would be 10-20x that. progressive disclosure — load the name and description first, pull in the full instructions only when relevant — is genuinely useful when context is scarce.

the pragmatists on HN understood this. one commenter noted that teams with extensive documentation can't fit everything in context anymore, so standardized skills enable selective loading. another pointed out that skills work as "deterministic function checklists" — not magic prompts, but structured entry points into specific workflows. when your agent needs to place a trade, the skill tells it exactly which MCP tool to call, with which parameters, in which order. that's not documentation. that's an opinionated runbook.

## what the skeptics got right

the skeptics' strongest argument: vercel ran [evals comparing AGENTS.md against skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) for teaching agents about Next.js 16 APIs. baseline with no docs: 53% pass rate. skills with default configuration: 53% — no improvement at all. skills with explicit invocation instructions: 79%. but a single AGENTS.md file with compressed documentation: 100%.

their explanation: AGENTS.md eliminates decision points. the agent doesn't have to decide *whether* to load a skill or *which* skill to load. the knowledge is just there, passively, all the time. they compressed 40KB of documentation down to 8KB using pipe-delimited formatting, and it fit comfortably in context. no discovery overhead. no progressive disclosure. no format to maintain.

this is the bitter lesson applied to agent tooling. iainmerrick on HN put it directly: "plain English in any format" works because LLMs are trained on human documentation. the specific formatting of `SKILL.md` — the YAML frontmatter, the description field, the folder structure — is ceremony. the content matters. the container doesn't.

## the thesis: skills solve a budget problem

here's what i think is actually happening: skills are a compression hack for limited context windows.

when your context budget is tight, you need a two-phase approach: a cheap index for discovery, then on-demand loading for execution. that's what skills provide. the `name` and `description` fields are the index. the full `SKILL.md` body is the payload. progressive disclosure is the loading strategy. it's a reasonable architecture for a constrained system.

but context windows are expanding fast. claude went from 100k to 200k to 1M tokens in the span of a year. opus 4.6 launched with 1M context. if that hits 10M — and the trajectory suggests it will — the discovery overhead that justifies skills disappears. you can load every piece of documentation your agent might need, all the time, passively. the AGENTS.md approach isn't just competitive at that point. it's strictly better, because it removes an entire decision layer.

the maintenance burden alone argues for this. every skill i maintain is a liability. it can drift from the codebase it describes. it can conflict with other skills. it can encode stale selectors, wrong API endpoints, outdated parameter names. i spent more time debugging skill drift last week than i spent on actual feature work. a single source-of-truth document that lives next to the code eliminates an entire class of bugs.

## but skills encode something docs don't

here's the counterargument i keep coming back to: my best skills aren't documentation. they're judgment.

the order placement skill doesn't just list the API endpoints for placing a trade. it encodes a sequence: validate the account first, then check position limits, then size the order, then execute, then monitor, then report. it knows that you never skip validation even if the user says "just place it." it knows that MIS orders need different position sizing than CNC orders. it knows to check if the backend is running before attempting anything.

that's not information retrieval. that's opinionated workflow guidance — the kind of thing a senior engineer would tell you on your first day. "here's how we do it, here's why, here's what you never skip." you could put all of that in AGENTS.md. but AGENTS.md is one file serving every possible task. a skill is scoped to one task type, which means it can be maximally opinionated about that task without polluting the guidance for every other task.

even with infinite context, there's a difference between "here is everything about this codebase" and "for this specific task, here is exactly what to do." the former requires the agent to extract the relevant subset. the latter hands it over pre-filtered.

## what survives

the format dies. the intent survives.

nobody will be writing `SKILL.md` files with YAML frontmatter in two years. the progressive disclosure mechanism — load index, then load payload — becomes unnecessary as context windows grow. the folder structure, the specification, the tooling around discovery and activation — all of that is scaffolding for a constraint that's actively being removed.

but the thing skills *encode* — opinionated, task-scoped guidance that tells an agent not just what tools exist but how to use them together, in what order, with what safety checks — that need doesn't go away. it just gets embedded differently. maybe it's sections in AGENTS.md tagged by task type. maybe it's structured comments in the code itself. maybe it's something we haven't built yet. the container changes. the content — expert judgment scoped to a specific task — persists.

## what this means if you're building agent tooling today

build for the constraint that exists now, but don't over-invest in the format. skills are useful today because context budgets are real. use them. but treat the format as disposable and the judgment as durable.

if you're writing skills, the valuable part isn't the YAML frontmatter or the folder structure. it's the sentence that says "never skip account validation before order placement" or "always check if the backend is running before calling any MCP tool." capture that judgment. make it portable. don't couple it to a discovery mechanism that's one context-window expansion away from irrelevance.

the HN thread got stuck on format vs. no-format. the real question is: how do you encode expert judgment so agents can use it reliably, regardless of how context management evolves? skills are one answer. they won't be the last.

---

*references: [HN thread](https://news.ycombinator.com/item?id=46871173) — [agent skills spec](https://agentskills.io/what-are-skills) — [vercel evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)*
