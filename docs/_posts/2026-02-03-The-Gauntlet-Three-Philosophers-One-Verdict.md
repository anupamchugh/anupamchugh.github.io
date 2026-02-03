---
title: "The Gauntlet: Three Philosophies, One Verdict"
date: '2026-02-03T18:00:00.000Z'
categories: [ai, agentic-workflows, skills]
keywords: [claude-code, skills, evaluation, build-vs-buy, software-longevity]
slug: /the-gauntlet-three-philosophies-one-verdict
published: false
---

# The Gauntlet: Three Philosophies, One Verdict

I kept building things I shouldn't have built.

Not bad things. Just unnecessary ones. MCPs that should have been skills. Tools that reinvented wheels. Features that wouldn't survive the AI-dominated future we're hurtling toward.

So I built a gate. A gauntlet that every idea must pass through before I write a single line of code.

## The Three Philosophies

The gauntlet runs three evaluations in parallel:

### 1. The Survivalist (Will It Last?)

This philosophy asks: *Will this survive when AI agents do most of the work?*

Think of software like species competing for resources. Six traits determine which ones thrive:

- **Encoded Wisdom** - Does it carry hard-won knowledge in its DNA?
- **Native Habitat** - Is code its natural home, or could it live as prose?
- **Range** - How many ecosystems can it inhabit?
- **Visibility** - Will other species (agents) discover it?
- **Worn Paths** - Are the desire paths already smooth?
- **Symbiosis** - Does it need humans to survive?

Score below 0.4? Don't build it. It'll go extinct or be ignored.

### 2. The Minimalist (Prose or Code?)

This philosophy is brutal: *Prose first. Code only when prose fails.*

Three gates:
1. Can prose describe this well enough for an LLM to execute?
2. Must this run without an LLM (cron job, API, daemon)?
3. Is friction unbearable at scale?

All three must say "need code" before you write code.

I learned this the hard way. Built a TypeScript scoring framework. Found 6 bugs across severity levels. All would have been avoided with a skill that says "scan tasks, prioritize recent ones."

Code has bugs. Prose has intent.

### 3. The Archivist (Does It Exist?)

Before building, check if something already exists:
- Does something already do this?
- What's the overlap percentage?
- What synergies are you missing?

Most "new" ideas have 60%+ overlap with existing tools—session memory, similarity matching, log analysis, parallel execution, task tracking, safety guards. The ecosystem is larger than you think.

## The Verdict Matrix

| Survivalist | Minimalist | Archivist Overlap | Verdict |
|-------------|------------|-------------------|---------|
| THRIVES | PROSE | None | GO - Create skill |
| THRIVES | PROSE | Full | PAUSE - Use existing |
| THRIVES | CODE | None | GO - Build tool |
| AT RISK | Any | Any | PAUSE or NO-GO |
| EXTINCT | Any | Any | NO-GO |

## Two Skills, Two Moments

I split this into two skills:

**`/gauntlet`** - Run BEFORE building. Evaluates ideas.
**`/gauntlet-review`** - Run AFTER building. Reviews code through the same three lenses.

The same philosophy that prevents bad ideas also catches bad implementations.

## Example: The Workspace Scanner

Last week I wanted to build a workspace scanning tool. Ran it through the gauntlet:

- **Survivalist**: Medium viability. Useful but not irreplaceable.
- **Minimalist**: Could be prose. An LLM can Glob + Read + analyze.
- **Archivist**: My task tracker already tracks work. Partial overlap.

Verdict: **PAUSE**. Extended existing tooling instead of building something new. Saved hours.

## The Deeper Pattern

The gauntlet isn't about preventing work. It's about directing energy.

Every hour spent on a NO-GO idea is an hour not spent on something that thrives. Every tool that should be a skill is a maintenance burden with no upside.

The three philosophies catch different blind spots:
- The Survivalist catches things that won't matter
- The Minimalist catches over-engineering
- The Archivist catches reinvention

Together, they form a complete filter.

## Try It

Next time you think "I should build X", run the gauntlet:

1. Will it thrive? (6 traits)
2. Should it be prose? (3 gates)
3. Does it exist? (ecosystem check)

If all three say GO, build with confidence. If any say PAUSE or NO-GO, you just saved yourself from building something that shouldn't exist.
