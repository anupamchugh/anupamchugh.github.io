---
title: "Shadowbook: The F1 Control Room for Complex Systems"
date: '2026-02-04'
categories: [systems, tooling]
keywords: [shadowbook, drift, observability, automation, f1, workflows, specs, skills, mcp]
slug: /shadowbook-f1-control-room
published: true
---

# Shadowbook: The F1 Control Room for Complex Systems

Systems drift under load. Specs move, tools fork, and agents operate on different maps. You can feel it before you can prove it. Shadowbook is how I made it visible.

I use a quiet F1 frame because it matches reality: grid assignments, pit‑wall calls, yellow flags, and the constant risk of unforced errors. The point is not the metaphor. The point is the workflow.

## The Race Weekend Loop

Start every run the same way. Keep it short, observable, and repeatable.

```bash
bd pacman            # grid assignment: who owns what
bd wobble            # speed sensor: skill drift
bd skills collisions # lane change: name collisions
bd spec scan         # track moved: spec drift
bd preflight --check # green flag: ship or stop
```

The loop works because each command can fail fast. No dashboards, no services. Just a pit wall that knows what changed.

## The Commands, Mapped to the Track

**Pacman is the grid.** You assign work without a server.

```bash
AGENT_NAME=codex bd pacman --join
bd close bd-123
```

**Wobble is the speed sensor.** If two agents run different playbooks, you slow down.

```bash
bd wobble
```

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

## The Archive: Old Rules, New Laps

Specs move, then settle. When they settle, you compact them and move them to cold storage. You keep history, but you stop paying the full cost.

```bash
bd spec compact specs/auth.md --summary "OAuth stabilized; MFA added."
bd spec show specs/auth.md --history
```

## Auto‑Matching: Beads Find the Right Spec

When an agent creates a bead, Shadowbook can suggest the best spec match based on content and path.

```bash
bd spec suggest beads-xyz
# → best match (92%)
```

This keeps the grid aligned without a long manual linking ritual.

## What We Built (Short and Concrete)

```bash
bd pacman                    # coordination
bd wobble                    # skill drift
bd skills collisions         # collision detection
bd spec scan                 # spec drift
bd spec volatility --trend   # stability drift
bd spec compact              # spec archive
bd spec suggest              # auto spec matching
bd preflight --check         # release gate
```

Each command is small. Together, they form the control room.

## Interplay (One Example)

A spec changes overnight. Pacman assigns the work. Wobble warns that Codex has older skills. Collisions catches a duplicate skill name before it overrides the new one. Spec scan shows the drift. Preflight blocks the release. You fix the map, then race.

That is the pit wall in practice.

---

If you want the deeper technical playbook, I will publish the specbeads and workflow design notes next.
