---
title: "Pacman Mode in Beads: Eating Tasks Without a Server"
date: '2026-02-01T18:00:00.000Z'
categories: [ai, tools]
keywords: [claude-code, codex, multi-agent, shadowbook, pacman, coordination]
slug: /pacman-mode
---

[Part 1](/skill-drift): skill drift. [Part 2](/spec-drift): spec drift. [Part 3](/snap-streaks): volatility tracking.

Part 4: **Coordinate multiple AI agents without a server.**

## The Problem

Claude Code runs supervised. Codex CLI runs overnight. Gemini handles a parallel task.

Each agent works alone. None knows:
- What's done
- What's in progress
- Who owns what
- When to stop

Servers solve this—agent mail, message queues, coordination services. Servers also fail. Agents lose contact. Work duplicates or stalls.

## The Solution: Files

Coordination through files:

```
.beads/
├── scoreboard.json    # Who closed what
├── agents.json        # Who's playing
└── pause.json         # Stop signal
```

Git syncs everything. No server to fail. Agent dies? Files persist. New agent? `git pull` and go.

## Pacman Mode

Shadowbook calls this "Pacman Mode"—gamified task management.

```bash
$ bd pacman

╭──────────────────────────────────────────────────────────╮
│  ᗧ····○ bd-abc····○ bd-xyz····○ bd-123 ····👻            │
╰──────────────────────────────────────────────────────────╯

YOU: claude
SCORE: 3 dots

DOTS NEARBY:
  ○ bd-abc ● P1 "Implement login flow"
  ○ bd-xyz ● P2 "Add retry logic"

BLOCKERS:
  ● bd-456 blocked by bd-789

LEADERBOARD:
  #1 codex   5 pts
  #2 claude  3 pts
```

**ᗧ** = you. **○** = tasks. **👻** = blockers.

All tasks done? Clear the maze:

```bash
╭──────────────────────────────────────────────────────────╮
│  ᗧ····················✓ CLEAR!                            │
╰──────────────────────────────────────────────────────────╯
```

## Scenarios

### Two Agents, Same Project

Claude runs supervised. Codex works in the background.

```bash
# Codex joins
AGENT_NAME=codex bd pacman --join
bd pacman                    # See available dots
bd close bd-123              # Close task, gain point
```

You check progress:

```bash
bd pacman
# LEADERBOARD:
#   #1 codex   3 pts
#   #2 claude  0 pts
```

### Emergency Stop

Production incident. All agents must stop.

```bash
bd pacman --pause "PRODUCTION DOWN"
```

Every agent's next `bd` command:

```
⏸️ PAUSED by claude: PRODUCTION DOWN
```

After the incident:

```bash
bd pacman --resume
```

### Parallel Work (3 Agents)

```bash
AGENT_NAME=claude bd pacman --join
AGENT_NAME=codex bd pacman --join
AGENT_NAME=gemini bd pacman --join

# Each takes a task
AGENT_NAME=claude bd close bd-p1
AGENT_NAME=codex bd close bd-p2
AGENT_NAME=gemini bd close bd-p3

bd pacman
# LEADERBOARD:
#   #1 claude  1 pts
#   #1 codex   1 pts
#   #1 gemini  1 pts
```

## Commands

| Command | Action |
|---------|--------|
| `bd pacman --join` | Register agent |
| `bd pacman` | Show dashboard |
| `bd assign bd-abc --to codex` | Hand off task |
| `bd ready --mine` | See your assignments |
| `bd pacman --pause "reason"` | Stop all agents |
| `bd pacman --resume` | Continue |
| `bd close bd-abc` | Close + score |

## Why Files Beat Servers

| Aspect | Server | Files |
|--------|--------|-------|
| Server down | Dead | N/A |
| Agent dies | Inbox stuck | Files persist |
| 10 projects | 10 registrations | Just `cd` |
| Sync | API calls | Git |
| Offline | Impossible | Works |

## The Pause Pattern

Key insight: every command checks for pause.

```go
func checkPauseSignal() {
    data, _ := os.ReadFile(".beads/pause.json")
    if data != nil {
        fmt.Fprintf(os.Stderr, "⏸️ PAUSED: %s\n", reason)
    }
}
```

`bd ready`? Sees pause. `bd close`? Sees pause. The warning is unavoidable.

## Session Handoff

End of day:
```bash
bd pacman    # Score: 5 pts
git push
```

Codex overnight:
```bash
git pull
AGENT_NAME=codex bd pacman --join
bd close bd-overnight-task
git push
```

Next morning:
```bash
git pull
bd pacman
# LEADERBOARD:
#   #1 codex  8 pts
#   #2 claude 5 pts
```

You see what happened while you slept.

## When You Need More

Pacman stays serverless. Add complexity only when necessary:

```bash
bd pacman --lock backend/*.py    # File reservation
bd pacman --discuss bd-abc       # Threaded discussion
```

Agent mail becomes a power-up, not a requirement.

## Try It

```bash
curl -fsSL https://raw.githubusercontent.com/anupamchugh/shadowbook/main/scripts/install.sh | bash
cd your-project && bd init
bd pacman --join
bd pacman
```

No server. No registration. Files and git.

**GitHub:** [anupamchugh/shadowbook](https://github.com/anupamchugh/shadowbook)

---

*Part 4 of the Shadowbook series. [Part 1: Skill Drift](/skill-drift) | [Part 2: Spec Drift](/spec-drift) | [Part 3: Snap Streaks](/snap-streaks)*
