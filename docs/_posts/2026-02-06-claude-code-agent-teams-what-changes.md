---
draft: false
title: "claude code agent teams — what changes for multi-agent coordination"
date: '2026-02-06T14:00:00.000Z'
categories: [agents, mcp, claude]
keywords: [claude-code, agent-teams, opus-4-6, mcp-agent-mail, multi-agent, coordination]
slug: /claude-code-agent-teams-what-changes
published: true
---

two days ago i submitted a [PR to MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail/pull/77) adding agent heartbeat presence, lifecycle management, and soft-block messaging. the problem i was solving: when you have multiple coding agents coordinating on a project, they have no idea if the other agents are alive. you send a message, it sits in an inbox forever because the recipient crashed 20 minutes ago. no bounce, no warning.

today anthropic shipped [claude code agent teams](https://code.claude.com/docs/en/agent-teams) alongside [opus 4.6](https://www.anthropic.com/news/claude-opus-4-6). look at what agent teams includes: a mailbox for inter-agent messaging, a shared task list with dependency tracking, file locking to prevent double-claims. that's MCP Agent Mail built into the runtime. same problem, same primitives, native now.

i enabled it and ran my first real session. here's what actually happened.

## the session

6 tasks from two plan documents on a Python/FastAPI codebase (~50k LOC). timestamp normalization across 4 API endpoints. a missing auth guard on an endpoint. sequential API calls that should be parallel. a new snapshot API with an MCP tool. infra health checks. created a team with 4 agents, each owning a different set of files.

results:

- **4 agents ran in parallel via tmux panes** — ~6 min wall clock vs ~18-20 min sequential
- **24 new tests** written and passing
- **0 file conflicts** — tasks were file-disjoint by design
- **token cost**: roughly 4x a single session

what actually worked: the shared task list with dependencies. one task needed a utility module created first — it was blocked on another task. when the first agent finished the module, the blocked task auto-unblocked and the second agent picked it up without me intervening. the infra-checking agent finished fastest so i shut it down while the coding agents kept going.

what broke: mid-session my claude code crashed with a React reconciler error ("No matching component was found for" in the Bun-bundled renderer). session state was completely lost with no recovery. the team's shared task list — the actual coordination state — died with it. would be nice if task state could survive a lead crash.

## what agent teams actually is

agent teams lets one claude code session spawn other claude code sessions as teammates. each teammate gets its own context window (up to 1M tokens on opus 4.6), its own tools and permissions, and a shared task list for coordination. the lead orchestrates. teammates work independently and can message each other directly — not just back to the lead.

the mechanics are file-based. teams live at `~/.claude/teams/{name}/config.json`. tasks live at `~/.claude/tasks/{name}/`. communication happens through inbox files on the shared filesystem. task claiming uses file locking to prevent race conditions when multiple teammates grab for the same work.

```
┌───────────────────────────────────────────────────────┐
│               YOUR SESSION (Team Lead)                │
│                                                       │
│  TeamCreate("my-team")                                │
│    └─ ~/.claude/teams/my-team/config.json             │
│    └─ ~/.claude/tasks/my-team/ (shared task list)     │
│                                                       │
│  Spawn teammates                                      │
│    └─ Each = separate Claude Code process             │
│    └─ Own context window, tools, permissions          │
│    └─ Loads CLAUDE.md + MCP servers + skills           │
│    └─ Does NOT inherit lead's conversation history    │
│                                                       │
│  Messaging:                                           │
│    SendMessage → teammate inbox file                  │
│    broadcast → all teammates (expensive, use rarely)  │
│    Idle notifications auto-fire when turn ends        │
│                                                       │
│  Task flow:                                           │
│    Lead creates tasks → teammates self-claim          │
│    File locking prevents double-claim                 │
│    Dependencies auto-unblock when predecessor done    │
│                                                       │
│  Lifecycle:                                           │
│    spawn → work → idle → message → work → shutdown    │
│    Shutdown = request (teammate can reject)            │
│    Team cleanup deletes all state                     │
└───────────────────────────────────────────────────────┘
```

this is different from subagents in an important way. a subagent runs inside your context, returns a result, and dies. a teammate runs beside you, persists across turns, and can talk to other teammates directly. subagents are function calls. teammates are collaborators.

you can display teammates inline (shift+up/down to navigate) or in split tmux/iTerm2 panes. there's a delegate mode that restricts the lead to coordination only — no code, just orchestration. and you can require plan approval before teammates touch anything.

## what i was building and where it overlaps

i [forked MCP Agent Mail](https://github.com/anupamchugh/mcp_agent_mail) and added four features. then agent teams shipped with its own versions of some of the same ideas.

**heartbeat presence.** agents emit heartbeats. the system computes a status — alive, stale, offline, unknown — based on configurable thresholds. i built this because "is this agent still running?" was an unanswerable question. you'd send a message and wait. and wait. agent teams has idle notifications — but idle just means "turn ended, waiting for input." it doesn't distinguish between "waiting" and "crashed three minutes ago." there's no staleness threshold, no presence computation. my session crash proved the point — three agents were still running fine but i had no way to know from outside the dead lead.

**lifecycle management.** `mark_agent_dead` and `revive_agent` MCP tools. dead agents are soft-blocked from receiving messages by default, with an `allow_dead_recipients` override for cases like audit trails. agent teams has shutdown requests — a teammate can approve or reject — but once they're gone, they're gone. no concept of marking an agent as dead while preserving its history and blocking new messages to it.

**soft-block messaging.** if an agent is dead, messages bounce by default. the caller knows immediately instead of silently dropping messages into a void. agent teams doesn't have this. if a teammate was shut down or crashed, messages to it just fail with no soft-block mechanism.

**local time formatting.** agent resources accept `?tz=Asia/Kolkata` and return local timestamps alongside UTC. small thing, but when you're coordinating agents across timezones and debugging "when did this agent last respond," UTC-only output costs you mental cycles. agent teams doesn't surface coordination timestamps at all.

## what gets sherlocked

here's what my setup actually looks like: claude code interactively during the day, hand work off to codex CLI overnight, review results in the morning. 60+ custom subagents. skill chains that run scan → plan → execute → monitor. spec drift detection across 400+ files. agent-mail stitching it all together across runtimes.

agent teams sherlocks one slice of that — the within-session coordination. if i'm running three claude code instances reviewing code from different angles, agent teams now handles that natively. better than an external MCP server could, because it's in the runtime. shared task list, direct messaging, task dependencies, file locking, shutdown protocol — all built in. no server to install, no token to configure.

but here's the thing: **agent teams dies when you close the terminal. my coordination layer doesn't.**

what agent teams doesn't touch:

**the overnight handoff.** codex runs a batch of tasks at 2am. claude code picks up at 9am. they need to know what the other did, what files were touched, what's still in progress. agent teams is session-scoped — when you clean up, everything is deleted. config, tasks, messages. `/resume` doesn't restore teammates. there's no durable state. i learned this the hard way when my lead crashed — the task list was gone, and i had to piece together what the agents had finished from git log.

**the persistent audit trail.** agent-mail backs every message, every lease, every heartbeat to git. searchable history after the session is over. agent teams coordination state exists only during the team's lifetime.

**file reservation leases.** when three different tools edit the same codebase — claude code on the frontend, codex on the backend, gemini CLI on the tests — someone needs advisory locks to signal "i'm working on this file." agent teams coordinates within claude code. it has no concept of cross-tool file reservations.

**presence detection across runtimes.** inside agent teams, the runtime knows who's alive because it spawned them. across tools and sessions, nobody knows. that's where heartbeat tracking matters — agents that come and go across different runtimes over hours or days, not minutes within a single session.

**domain-specific workflows.** spec drift detection, multi-step pipelines with policy gates, behavioral consistency checks across agents — these are too niche for anthropic to ship as platform features. they live in custom subagents and skill chains that compose on top of whatever coordination layer exists.

## what it's actually like right now

agent teams is experimental and it shows. the rough edges are real, not hypothetical — i hit several in one session.

**the key constraint is plan decomposition.** two agents editing the same file means overwrites. your plan structure matters more than the agents themselves. well-structured plans with clear file ownership parallelize well. messy plans don't. i spent more time decomposing tasks into file-disjoint units than i did running the team.

**the lead crash killed everything.** heavy MCP + hooks + 4 agents seems to stress the UI layer. react reconciler error, full session loss, no recovery path. the task list — the one piece of coordination state that matters — was gone. git commits survived because they're external state. everything else didn't.

**teammates crash and don't recover.** if a teammate hits an error, it may just stop instead of retrying or working around the problem. you have to notice, select the teammate, give it new instructions, or spawn a replacement. there's no automatic recovery, no "this agent is stuck" alert.

**the lead sometimes does the work itself.** without delegate mode enabled, the lead may start implementing tasks instead of waiting for teammates to finish. delegate mode (shift+tab) fixes this by restricting the lead to coordination-only tools, but it's opt-in and easy to forget.

**task status gets out of sync.** teammates sometimes forget to mark tasks as completed, which blocks dependent tasks. you end up checking whether work is actually done and nudging the lead to update status manually.

**no session resumption.** terminal disconnect = teammates gone. the lead doesn't know they're gone and tries to message them anyway.

**split panes need tmux or iTerm2.** no VS Code integrated terminal, no Windows Terminal, no Ghostty.

these are early-release problems. but they explain why agent teams is best understood as burst parallelism — focused teams you actively watch. the 3x speedup (6 min vs 18-20 min) is real. the reliability for unattended work isn't there yet.

## the pattern

platforms absorb the generic layer. the tools closest to your specific problem survive.

intra-session orchestration is now a platform feature. agent teams handles it natively and there's no reason to run an external MCP server for within-session claude-code-to-claude-code coordination anymore.

cross-session, cross-tool coordination — claude code to codex to gemini, with state that persists across all of them — is still where community tooling has room. so are domain-specific workflows: multi-step pipelines with policy gates, spec drift detection across hundreds of files, behavioral consistency checks that enforce rules agents would otherwise forget.

the features i built for agent-mail — heartbeat presence, lifecycle management, soft-block messaging — land squarely in that surviving layer. they matter most when agents come and go across different runtimes over days, not minutes within one session.

the line is drawn. inside a claude code session, coordination is native. outside it, the frontier is wide open.

---

*code: [anupamchugh/mcp_agent_mail](https://github.com/anupamchugh/mcp_agent_mail) (fork with lifecycle features) — [PR #77](https://github.com/Dicklesworthstone/mcp_agent_mail/pull/77) (upstream review)*
