---
draft: false
title: "i built a tool that became obsolete in four days"
date: '2026-02-01T18:00:00.000Z'
categories: [tools, claude]
keywords: [claude-code, github, debugging, misdiagnosis, workspace-bloat]
slug: /check-github-issues-before-building
published: true
---

my M4 Mac was eating battery faster than a cryptocurrency miner at a free electricity convention. terminal kept freezing. fans spinning for no visible reason. activity monitor showed runaway CPU from processes i didn't recognize — child spawns from claude code sessions that should have exited hours ago.

this went on for two days before i decided to fix it.

## the diagnosis

the workspace made sense as a suspect. i'd been running claude code on a trading platform codebase for months and the project had grown organically into something unreasonable. 60+ custom skills in `.claude/skills/`. hundreds of session files accumulating in `.claude/sessions/`. nested MCP server configs. a `specs/` directory with 400+ markdown files. beads metadata scattered across the repo. the `.claude/` directory alone was approaching 50MB.

every time i opened a new claude code session, it loaded all of this. skill descriptions get injected into the system prompt. session history files get scanned for context recovery. MCP configs get parsed and servers get spawned. it felt plausible — maybe even obvious — that processing all of this on every session start was grinding the machine to a halt. especially with multiple sessions running in parallel across tmux panes.

i'd also noticed the session JSONL files were getting large. some were tens of megabytes for a single conversation. that tracks with known behavior — claude code logs every tool call, every response, every piece of context. multiply that by dozens of sessions over weeks without cleanup and you've got a lot of disk I/O happening in the background.

the theory was clean: workspace bloat causes slow startup, slow startup causes repeated retries, retries cause CPU spikes, CPU spikes drain battery. fix the bloat, fix the battery.

## what i built

i spent about a day building `@declutter` — a workspace scanner skill backed by an MCP tool. it did three things:

1. measured every directory under `.claude/` and ranked them by size
2. flagged session files older than 7 days, skills that hadn't been invoked in 30 days, and orphaned config fragments
3. suggested cleanup actions — archive old sessions, prune unused skills, consolidate redundant configs

it worked well. ran it on my workspace, found 180+ stale session files, identified 12 skills that were superseded by meta-skills, flagged a few orphaned MCP configs from servers i'd since renamed. cleaned up about 35MB of cruft.

the mac was still hot.

## the discovery

four days after my initial diagnosis, i was scrolling through claude code's GitHub issues looking for something unrelated — a tmux pane splitting bug — and stumbled on [issue #22042](https://github.com/anthropics/claude-code/issues/22042). someone reported that claude code 2.1.27 had a hook bug where pre-tool-use hooks could write corrupted JSONL to session files. the corruption caused the session loader to spin in an infinite retry loop on startup, parsing malformed JSON lines that would never parse.

the symptoms matched exactly. high CPU on session start. processes that wouldn't die. battery drain from background retries. the fix was either deleting the corrupted session files or updating to 2.1.29 where the hook serialization was patched.

i deleted the session files. fans stopped. battery returned to normal. the entire problem was three corrupted JSONL files totaling about 400KB.

## the lesson

the tool i built wasn't wrong. `@declutter` correctly identified workspace bloat and cleaned it up. 35MB of stale files is genuinely worth cleaning. the skill still exists, archived, and i'd use it again for workspace hygiene.

but it didn't fix the problem i built it to fix. i spent a day building a solution to the problem i diagnosed, when the actual problem had already been diagnosed by someone else and posted publicly. one search would have saved me the day.

the sequence matters:

1. **search first.** github issues, open PRs, the status page, community forums. someone else has probably hit it.
2. **reproduce second.** isolate the symptom. is it really what you think it is? i never tested whether removing skills changed the CPU behavior. i assumed the correlation.
3. **build third.** only after confirming the problem is actually yours to solve.

i did it backwards. i started at step 3 because building felt productive. diagnosing feels like waiting. searching feels like admitting you don't know. building feels like progress. but building on a wrong diagnosis is motion without progress.

## the pattern

there's a broader version of this that shows up whenever you have AI coding agents in the loop. the agent sees a symptom, generates a plausible theory, and starts building a fix. it's doing exactly what you'd want — proactive problem-solving. but the agent has no incentive to search GitHub issues first. it doesn't know that the tool it's building is solving a misdiagnosed problem. it optimizes for the theory it has, not the theory it should look for.

when i asked claude to help me investigate the battery drain, it immediately started analyzing workspace structure, measuring directory sizes, suggesting cleanup strategies. all reasonable. all wrong. it was amplifying my misdiagnosis by building tools that made the wrong theory look more credible. "look, we found 180 stale files!" felt like validation. it wasn't — it was a true fact that was irrelevant to the actual problem.

this is the failure mode: when agents build tools to fix symptoms, they make the original misdiagnosis feel confirmed. you get working code that solves the wrong problem, which is harder to let go of than no code at all.

the antidote is boring. before building anything, search for the exact error message. search for the exact symptom. search for the tool name plus "issue" or "bug." spend ten minutes reading other people's problems before spending a day solving your own. the fix for my four-day battery drain saga was already sitting in a GitHub issue, posted two days before i started building.

the tool became obsolete because the problem it solved never existed. the problem that did exist had a one-line fix.

---

*the bug was fixed in [version 2.1.29](https://github.com/anthropics/claude-code/issues/22042). i spent 4 days building around a misdiagnosis. declutter is archived at [github.com/anupamchugh/declutter](https://github.com/anupamchugh/declutter).*
