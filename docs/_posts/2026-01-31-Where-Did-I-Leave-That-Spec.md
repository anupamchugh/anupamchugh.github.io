---
published: true
title: "Where Did I Leave That Spec?"
date: '2026-01-31T12:00:00.000Z'
categories: [ai, tools]
keywords: [shadowbook, activity-dashboard, context-amnesia, ai-agents, productivity]
slug: /where-did-i-leave-that-spec
---

Monday morning. Coffee. Terminal open. And the question that haunts every fast-moving codebase:

*What was I working on?*

I have 76 specs. 127 beads (tasks). Skills scattered across two agents. Code shipping so fast that yesterday's feature is today's refactor target.

[Spec drift](https://chughgpt.substack.com/p/the-vibe-clock-drift-problem) was problem one. [Skill drift](https://anupamchugh.github.io/skill-drift) was problem two.

Now there's a third: **I can't see what's hot and what's cold.**

## The Chaos

My codebase ships fast. Really fast. Features land, get torn out, land again differently. Specs pile up. Some are done. Some are abandoned. Some are half-implemented with a bead somewhere that I forgot about.

I grep through folders. I check git logs. I open five markdown files trying to remember which one had the auth spec. Was it `LOGIN_SPEC.md` or `AUTH_FLOW.md`? Did I close that bead or just stop working on it?

**This is Context Amnesia.** The silent killer of momentum.

## One Command

```bash
bd recent --all
```

That's it. Everything I've touched, nested by relationship:

```
bd-bw3 [P2] Add TUI dashboard...  ○ open  20m ago
  └─ (no linked spec)

Unlinked specs:
  ● specs/SHADOWBOOK_FEATURE_OPPORTUNITIES.md  ✓ active  5h ago
  ● specs/SPEC_ID_PR_FIX.md  ✓ active  18h ago

Unlinked skills:
  ✓ brainstorming (superpowers)  26m ago

──────────────────────────────────────────
Summary: 1 beads, 11 specs, 1 skills
⎿ Active: 1 pending
└─ Momentum: 5 items updated today
```

Beads show their specs. Specs show their skills. Orphans get called out. Stale items (30+ days untouched) get a snowflake: ❄

## What I Actually Use

**Start of day:**
```bash
bd recent --today
```
What moved in the last 24 hours? Context recovery in 2 seconds.

**Weekly cleanup:**
```bash
bd recent --stale
```
What did I abandon? Specs I forgot about. Skills nobody uses. Zombie work cluttering my head.

**Before shipping:**
```bash
bd recent --all
```
Full picture. What's linked. What's orphaned. What's the momentum.

## Why This Matters

When code ships fast, specs pile up. You write one, implement half of it, pivot, write another. Three months later you have 76 specs and no idea which ones are done.

The Activity Dashboard makes the chaos visible. Not fixed—visible. That's the first step.

Now when I sit down, I don't grep. I don't open five files. I run one command and see:

- What's active
- What's abandoned
- What's orphaned
- What moved today

**The codebase is still chaotic. But now I can see the chaos.**

---

```bash
# Install
curl -fsSL https://raw.githubusercontent.com/anupamchugh/shadowbook/main/scripts/install.sh | bash

# See your chaos
bd recent --all
```

[GitHub: anupamchugh/shadowbook](https://github.com/anupamchugh/shadowbook)
