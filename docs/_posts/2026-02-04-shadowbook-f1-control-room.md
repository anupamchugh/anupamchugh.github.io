---
title: "Shadowbook: The F1 Control Room for Complex Systems"
date: '2026-02-04'
categories: [systems, tooling]
keywords: [shadowbook, drift, observability, automation, f1, workflows, specs, skills, mcp]
slug: /shadowbook-f1-control-room
draft: true
published: false
---

Systems drift under load. Specs move, tools fork, and agents operate on different maps. You can feel it before you can prove it. Shadowbook is how I made it visible.

I use an F1 frame because it matches reality: grid assignments, pit‑wall calls, yellow flags, and the constant risk of unforced errors. The point is not the metaphor. The point is the workflow.

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
```

Each command is small. Together, they form the control room.

## Interplay (one example)

A spec changes overnight. Pacman assigns the work. Wobble flags behavioral drift in recent sessions. Collisions catches a duplicate skill name before it overrides the new one. Spec scan shows the drift. Preflight blocks the release. You fix the map, then race.

That is the pit wall in practice.

---

If you want the deeper technical playbook, I will publish the specbeads and workflow design notes next.
