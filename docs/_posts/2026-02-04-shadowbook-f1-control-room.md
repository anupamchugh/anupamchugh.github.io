---
title: "Shadowbook: The F1 Control Room for Complex Systems"
date: '2026-02-04'
categories: [systems, tooling]
keywords: [shadowbook, drift, observability, automation, f1, workflows, specs, skills, mcp]
slug: /shadowbook-f1-control-room
draft: false
published: true
---

Spec-driven workflows break in slow, expensive ways. The spec starts clean, then accretes edge cases, caveats, and context files. The code moves, the spec moves, and the two stop moving together. You feel the drift first; you confirm it much later.

That is why I use an F1 frame. In a race, the car can be perfect and still lose if the pit wall misses a yellow flag or reads the wrong map. Spec-driven work is the same: success depends on how fast you detect changes and how reliably you gate the next lap. Shadowbook is my pit wall for that problem.

## The race weekend loop

Start every run the same way. Keep it short, observable, and repeatable.

```bash
bd pacman                        # grid assignment: who owns what
bd wobble scan --from-sessions --days 7  # behavioral drift (misalignment)
bd skills collisions             # lane change: name collisions
bd spec scan                     # track moved: spec drift
bd preflight --check             # green flag: ship or stop
```

The loop works because each command can fail fast. No dashboards, no services. Just a pit wall that knows what changed.

## How the journey solves spec drift

Shadowbook turns specs into stateful artifacts. When a spec changes, you do not just hope someone noticed. You surface the change, flag linked work, and block release until a human acknowledges the drift. The workflow makes the invisible visible and forces the right pause before the next lap.

## A concrete drift example

```bash
# Spec changes overnight
bd spec scan

# Linked beads get flagged
bd list --spec-changed

# Volatility warns you not to build on churn
bd spec volatility --trend specs/auth.md

# Preflight blocks the release until reviewed
bd preflight --check

# After review, clear the flag and proceed
bd update bd-123 --ack-spec
```

## The commands, mapped to the track

**Pacman is the grid.** You assign work without a server, and you can see the race in one line.

```bash
AGENT_NAME=codex bd pacman --join
bd close bd-123
```

What the viewer shows (grid + score + leaderboard):

```bash
$ bd pacman

╭──────────────────────────────────────────────────────────╮
│  ᗧ····○ bd-abc····○ bd-xyz····○ bd-123 ····◐            │
╰──────────────────────────────────────────────────────────╯

YOU: claude | SCORE: 3 dots | #1 codex (5 pts)
```

This is the pit‑wall scoreboard. It’s intentionally small, but it answers the two questions that kill momentum: *who owns what* and *who is blocked*.

**Wobble is the speed sensor.** It measures behavioral drift: the gap between what a skill says and what the agent actually does in real sessions.

```bash
bd wobble scan --from-sessions --days 7
```

Software engineering philosophy: specs and skills are not truth; **behavior is**. When a tool claims “do X” but does “Y,” the system quietly diverges. Wobble makes that divergence measurable. It parses real session transcripts, extracts the invoked skill and the commands that actually ran, then computes bias/variance. If nothing scores STABLE, it is not a failure of intent. It is a failure of structure: unclear defaults, ambiguous options, or missing constraints.

**Collisions are unsafe lane changes.** Two skills with one name is a crash waiting to happen.

```bash
bd skills collisions --quiet
```

**Spec drift is the track moving.** The map changed, and your car did not.

```bash
bd spec scan
```

**Volatility is tire wear.** A spec that churns is not ready for a long stint.

```bash
bd spec volatility --trend specs/auth.md
```

**Preflight is the green flag.** If anything is red, you don’t start the race.

```bash
bd preflight --check
```

## Snap streaks: stability you can see

Specs change. The hidden cost is not the change, it is the uncertainty. Snap streaks visualize stability so you stop building on quicksand.

```bash
$ bd spec volatility --trend specs/auth.md

  Week 1: ████████░░  8 changes
  Week 2: █████░░░░░  5 changes
  Week 3: ██░░░░░░░░  2 changes
  Week 4: ░░░░░░░░░░  0 changes

Status: DECREASING
Prediction: Safe to resume work in ~5 days
```

Badges show up everywhere. The point is to see risk at a glance.

```bash
$ bd list --show-volatility
  bd-42  [● volatile] Implement login    in_progress
  bd-44  [○ stable]    Update README     pending

$ bd ready
○ Ready (stable): 1. Update README
● Caution (volatile): 1. Implement login (5 changes/30d, 3 open)
```

If you want the longer version, it lives here: [snap your spec streaks](/snap-your-spec-streaks).

## The archive: old rules, new laps

Specs move, then settle. When they settle, you compact them and move them to cold storage. You keep history, but you stop paying the full cost.

```bash
bd spec compact specs/auth.md --summary "OAuth stabilized; MFA added."
bd spec show specs/auth.md --history
```

## Auto‑matching: beads find the right spec

When an agent creates a bead, Shadowbook can suggest the best spec match based on content and path.

```bash
bd spec suggest beads-xyz
# → best match (92%)
```

This keeps the grid aligned without a long manual linking ritual.

## F1 mode: what the pit wall actually sees

The loop is the pit wall. The pacman viewer is the grid. Wobble is the telemetry delta. Volatility is tire wear. Preflight is the green‑flag checklist. If a spec changes, you see it on the wall before the car leaves the garage.

That is the point: compress the system into one glance, then enforce with gates.

## What this is not

The control room does not replace code quality. It is a guardrail for intent and coordination, not a substitute for tests or correctness.

It also does not require a new language. The hard part is not syntax. The hard part is knowing when context changed and enforcing a stop until humans re‑align.

## Agent teams: the pit wall goes multi‑car

Claude Code shipped agent teams (Feb 2026) — parallel Claude instances with shared task lists. The problem: no bridge between where work is tracked (beads) and where work is executed (agent teams). Without coordination, multiple agents on the same codebase is a multi‑car pileup at Turn 4.

`bd team` is the bridge. Six commands, each mapped to a phase of race operations.

```bash
bd team plan beads-abc       # race strategy: DAG → parallel waves
bd team gate specs/auth.md   # track inspection: is the spec stable?
bd team watch                # live telemetry: agent progress dashboard
bd team score                # championship points: pacman per agent
bd team wobble               # post‑race debrief: did agents follow briefs?
bd team report               # full post‑mortem: metrics, drift, conflicts
```

**`bd team plan`** analyzes the epic's dependency graph and outputs parallel waves — which beads can run simultaneously, which must wait. The critical safety check: **file disjointness**. Two agents editing the same file is a collision. The planner rejects plans where files overlap within a wave.

```bash
$ bd team plan beads-abc

╭─ Team Plan: Auth Redesign + API Hardening ────────────╮
│                                                        │
│  Wave 1 (parallel):                                    │
│    ○ beads-123  Create auth_utils.py      [2 files]    │
│    ○ beads-456  Security audit            [2 files]    │
│                                                        │
│  Wave 2 (after wave 1):                                │
│    ○ beads-789  Apply auth to endpoints   [1 file]     │
│      └─ blocked by: beads-123                          │
│                                                        │
│  Validation:                                           │
│    ✓ File-disjoint (no conflicts)                      │
│    ✓ Max parallelism: 2 agents                         │
│    ✓ Spec volatility: LOW                              │
╰────────────────────────────────────────────────────────╯
```

**`bd team gate`** blocks assignment if the spec is volatile. You don't send cars onto a track that hasn't been inspected. **`bd team watch`** gives you real‑time telemetry — which agent is working on what, who's idle, who's blocked. **`bd team wobble`** runs post‑session to check if agents stayed on‑brief or freelanced.

The output is orchestrator‑agnostic JSON. Claude Code, Codex, or any orchestrator can consume it. Beads stay the source of truth; agent teams are the execution layer.

| Before | After |
|--------|-------|
| ~5 min manual `TaskCreate × N` | `bd team plan` in 2 seconds |
| No visibility from bd | Real‑time dashboard |
| Manual bead closure | Auto‑close on task completion |
| No quality check | `bd team wobble` scores fidelity |

## What we built (short and concrete)

```bash
bd pacman                    # coordination
bd wobble scan --from-sessions --days 7  # behavioral drift
bd skills collisions         # collision detection
bd spec scan                 # spec drift
bd spec volatility --trend   # stability drift
bd spec compact              # spec archive
bd spec suggest              # auto spec matching
bd preflight --check         # release gate
bd team plan <epic>          # multi-agent execution plan
bd team gate <spec>          # volatility gate for teams
bd team watch                # live agent telemetry
bd team score                # agent leaderboard
bd team wobble               # post-session drift check
bd team report               # full post-mortem
```

Each command is small. Together, they form the control room.

## Interplay (one example)

A spec changes overnight. Pacman assigns the work. Wobble flags behavioral drift in recent sessions. Collisions catches a duplicate skill name before it overrides the new one. Spec scan shows the drift. Preflight blocks the release. You fix the map, then race.

Now scale that to agent teams: `bd team gate` checks the spec is stable. `bd team plan` splits the epic into parallel waves with file‑disjoint tasks. Three agents spawn, each on their own piece of track. `bd team watch` shows live telemetry. When they finish, `bd team wobble` checks nobody freelanced, and `bd team report` gives you the full post‑mortem.

That is the pit wall in practice — now coordinating the whole grid, not just one car.

---

If you want the deeper technical playbook, I will publish the specbeads and workflow design notes next.
