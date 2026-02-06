---
published: true
title: "Pacman Mode in Beads: Eating Tasks Without a Server"
date: '2026-02-01T18:00:00.000Z'
categories: [ai, tools]
keywords: [claude-code, codex, multi-agent, shadowbook, pacman, coordination]
slug: /pacman-mode
---

[Part 1](/skill-drift): skill drift. [Part 2](/spec-drift): spec drift. [Part 3](/snap-streaks): volatility tracking.

Part 4: **coordination without a server.**

## The Problem (One Paragraph)

Multiple agents run in parallel. None knows what’s done, what’s blocked, or who owns what. Servers solve this but introduce a new failure: the server.

## The Solution (One Idea)

Use files as the coordination layer.

```
.beads/
├── scoreboard.json
├── agents.json
└── pause.json
```

Git syncs them. No infra. No single point of failure.

## The Skill: `bd pacman`

One command acts as a coordination surface.

```bash
bd pacman
```

```
YOU: claude   SCORE: 3
DOTS: bd-abc, bd-xyz
BLOCKERS: bd-456 ← bd-789
LEADERBOARD: codex 5, claude 3
```

**ᗧ** = you. **○** = tasks. **👻** = blockers.

## The Workflow (Short and Repeatable)

### 1) Join the board
```bash
AGENT_NAME=codex bd pacman --join
```

### 2) Take work
```bash
bd close bd-123
```

### 3) Sync
```bash
git push
```

### 4) Hand off
```bash
git pull
bd pacman
```

That’s the loop.

## The Kill Switch

Pause every agent with one file.

```bash
bd pacman --pause "PRODUCTION DOWN"
```

Every `bd` command checks:

```go
func checkPauseSignal() {
    if paused() { fmt.Println("PAUSED") }
}
```

Resume:

```bash
bd pacman --resume
```

## Short Use Cases Across Shadowbook

Here’s what Pacman looks like alongside the rest of the system—small, repeatable snippets.

### Pacman: Coordination Without a Server
```bash
AGENT_NAME=codex bd pacman --join
bd close bd-123
```

### Wobble: Find Skill Drift
```bash
bd wobble
# drift detected between ~/.claude/skills and ~/.codex/skills
```

### Collisions: Stop Silent Skill Overrides
```bash
bd skills collisions --quiet
# collisions found in project + global registries
```

### Spec Drift: Catch “Specs Moved, Code Didn’t”
```bash
bd spec scan
# unacknowledged changes in specs/
```

### Stability Drift: Volatility Over Time
```bash
bd spec volatility --trend specs/auth.md
```

### Ready: See Work Without Blockers
```bash
bd ready
```

### Recent: Get a Fast Activity Pulse
```bash
bd recent
```

### Preflight: Gate Before You Ship
```bash
bd preflight --check
```

If you want a full “feature → file → command” index, I can add it.

## Why Files Beat Servers (One Line)

Servers die. Files persist.

## Try It

```bash
curl -fsSL https://raw.githubusercontent.com/anupamchugh/shadowbook/main/scripts/install.sh | bash
cd your-project && bd init
bd pacman --join
bd pacman
```
