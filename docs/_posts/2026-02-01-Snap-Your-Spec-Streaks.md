---
title: "Snap Your Spec Streaks"
date: '2026-02-01T12:00:00.000Z'
categories: [ai, tools]
keywords: [shadowbook, spec-volatility, stability-drift, ai-agents, beads, snap-streaks]
slug: /snap-your-spec-streaks
---

Specs change. Sometimes too much.

A spec that changes five times in a week while three engineers build against it creates chaos. Work drifts. Reviews fail. Rework multiplies.

This is **Stability Drift**—the fourth horseman of agent chaos, after [Spec Drift](https://chughgpt.substack.com/p/the-vibe-clock-drift-problem), [Skill Drift](https://anupamchugh.github.io/skill-drift), and [Visibility Drift](https://anupamchugh.github.io/where-did-i-leave-that-spec).

Shadowbook now tracks it visually.

## The Timeline of Pain

Day 1: Create issue `bd-42` linked to `specs/auth.md`.

Day 2: Start building.

Day 3: Someone updates the spec at 3am. You don't notice.

Day 5: Code review. *"This doesn't match the spec."*

Day 6: Realize you need to redo everything.

This happens constantly. Specs change. Teams don't communicate. Work compounds on unstable foundations.

## Snap Streaks

Like Snapchat streaks, but for specs.

```bash
$ bd spec volatility --trend specs/auth.md

VOLATILITY TREND (specs/auth.md):

  Week 1: ████████░░  8 changes
  Week 2: █████░░░░░  5 changes
  Week 3: ██░░░░░░░░  2 changes
  Week 4: ░░░░░░░░░░  0 changes

Status: DECREASING
Prediction: Safe to resume work in ~5 days
```

Four weeks. One bar per week. Filled blocks show changes.

**Reading the streak:**

- **Declining** → The spec is settling. Wait, then build.
- **Flat at zero** → Locked down. Build confidently.
- **Increasing** → Chaos growing. Stop. Stabilize first.
- **Erratic** → No agreement on requirements. Talk to the team.

Unlike Snapchat, you *want* this streak to die.

## Fire Badges

Every bead shows its spec's stability at a glance:

```bash
$ bd list --spec specs/auth.md

  bd-42  [🔥 volatile] Implement login    in_progress
  bd-43  [🔥 volatile] Add 2FA           pending
  bd-44  [⚡ stable]    Update README     pending
```

🔥 means danger. ⚡ means safe.

When you run `bd ready`, volatile specs get called out:

```bash
$ bd ready

📋 Ready work (3 issues with no blockers):

1. [P2] [open] bd-12: Update docs

🔥 Caution (volatile specs):

1. [P1] [in_progress] bd-42: Implement OAuth
   (🔥 volatile: 5 changes/30d, 3 open issues)

🔥 Recommendation: stabilize volatile specs before starting new work.
```

## Smart Warnings

Try to create an issue on a volatile spec:

```bash
$ bd create --spec specs/auth.md "Implement OAuth"

🔥 specs/auth.md is volatile (5 changes in 30d, 3 open issues)
   Last changed: 2026-01-30
   Consider: Stabilize spec before starting work.

Create anyway? [y/N]
```

Shadowbook doesn't block you. It warns you. Your choice.

## Cascade Impact

One unstable spec can block many issues.

```bash
$ bd spec volatility --with-dependents specs/auth.md

specs/auth.md (🔥 HIGH volatility: 5 changes, 3 open)
├── bd-42: Implement login (in_progress) ← DRIFTED
│   └── bd-43: Add 2FA (blocked by bd-42)
└── bd-44: RBAC redesign (pending)

IMPACT SUMMARY:
  • 2 issues directly affected
  • 1 issue blocked downstream
  • Total cascade: 3 issues at risk

RECOMMENDATION: STABILIZE: lock spec and unblock dependents
```

Three issues at risk. One spec change propagates through the dependency graph.

## Auto-Pause

If you want Shadowbook to act automatically:

```bash
bd config set volatility.auto_pause true
```

When a spec becomes HIGH volatility, Shadowbook moves linked issues to `blocked` status. No more building on quicksand.

Resume after the spec stabilizes:

```bash
bd resume --spec specs/auth.md
```

## CI Integration

Block PRs that touch volatile specs:

```bash
bd spec volatility --fail-on-high
```

Exit code 1 if any spec is HIGH volatility. Add to your pipeline:

```yaml
- name: Check spec stability
  run: bd spec volatility --fail-on-high
```

## The Four Drifts

Shadowbook now tracks all four:

| Drift | Problem | Solution |
|-------|---------|----------|
| **Spec Drift** | Spec changed, code didn't | `bd spec scan` |
| **Skill Drift** | Agents have different skills | `bd preflight` |
| **Visibility Drift** | Can't see what's active | `bd recent --all` |
| **Stability Drift** | Spec churning while building | `bd spec volatility` |

Run them all with `bd preflight --check`:

```bash
$ bd preflight --check

✓ Skills: 47/47 synced
✓ Specs: 12 tracked, 0 unacknowledged changes
🔥 Volatility: 2 specs have high churn
  • specs/auth.md     (5 changes, 3 open issues)
  • specs/api.md      (3 changes, 2 open issues)

Overall: PASS with warnings
```

## Get Recommendations

Ask Shadowbook what to do:

```bash
$ bd spec volatility --recommendations

RECOMMENDATIONS BY SPEC:

specs/auth.md (🔥 HIGH)
  Action: STABILIZE: lock spec and unblock dependents
  Reason: 5 changes, 3 open issues, 1 dependents

specs/old-feature.md (⚡ STABLE)
  Action: ARCHIVE: safe to compact
  Reason: 0 changes, 0 open issues
```

Four actions:
- **STABILIZE**: Freeze changes, complete in-flight work
- **REVIEW**: Check spec before starting
- **MONITOR**: Proceed with caution
- **ARCHIVE**: No activity, safe to compact

## The Point

Stability is a feature.

A spec that doesn't change is a spec you can build against. A spec that changes constantly is a spec that wastes everyone's time.

Track the streak. Let it die. Then ship.

---

*Shadowbook is open source: [github.com/anupamchugh/shadowbook](https://github.com/anupamchugh/shadowbook)*
