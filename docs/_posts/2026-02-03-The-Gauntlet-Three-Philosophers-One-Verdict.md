---
draft: true
title: "The Gauntlet: Three Questions Before You Build"
date: '2026-02-03T18:00:00.000Z'
categories: [ai, software-engineering, decision-making]
keywords: [build-vs-buy, engineering-discipline, ai-era, skills, agentic-workflows]
slug: /the-gauntlet-three-questions-before-you-build
published: false
---

# The Gauntlet: Three Questions Before You Build

I kept building things I shouldn't have built.

Not bad things. Just unnecessary ones. Tools that reinvented wheels. Code that should have been documentation. Features that won't matter in two years.

So I built a gate. Three questions every idea must answer before I write a single line of code.

## The Old Decision: Build vs Buy

For decades, engineering had a binary choice:

- **Build** — write it yourself
- **Buy** — use someone else's solution

Simple. But incomplete.

## The New Decision: Build vs Buy vs Describe

AI changed the equation. There's now a third option:

- **Build** — write code
- **Buy** — use existing tools
- **Describe** — write prose that an LLM executes

A skill file that says "scan for stale tasks, prioritize by recency" often beats a hand-rolled scanning tool. The LLM interprets intent. Code just follows instructions.

This isn't laziness. It's recognizing that prose carries intent while code carries bugs.

## The Three Questions

Before building anything, answer these:

### 1. Does this already exist?

Most "new" ideas overlap 60%+ with existing tools. Session memory, similarity search, log analysis, parallel execution, task tracking—the ecosystem is larger than you think.

**If it exists:** Use it. Extend it. Don't reinvent it.

### 2. What's the minimum viable form?

Three gates:
1. Can prose describe this well enough for an LLM to execute?
2. Must this run without an LLM present (cron job, API, daemon)?
3. Is the friction unbearable at prose-level scale?

All three must say "need code" before you write code.

**If prose works:** Write a skill, not a tool.

### 3. Will this matter in two years?

Software competes for survival. Ask:
- Does it encode hard-won knowledge, or can an LLM regenerate it?
- Is it broadly useful, or narrowly conditional?
- Will agents discover it, or will it rot in obscurity?

**If it won't survive:** Don't build it. Document the idea and move on.

## The Decision Tree

```
┌─────────────────────────────────────┐
│ "I should build X"                  │
└─────────────────┬───────────────────┘
                  ▼
        ┌─────────────────┐
        │ Does it exist?  │
        └────────┬────────┘
                 │
      YES ◄──────┴──────► NO
       │                   │
       ▼                   ▼
    USE IT         ┌──────────────┐
                   │ Can prose    │
                   │ describe it? │
                   └──────┬───────┘
                          │
               YES ◄──────┴──────► NO
                │                   │
                ▼                   ▼
          WRITE SKILL      ┌──────────────┐
                           │ Will it      │
                           │ survive?     │
                           └──────┬───────┘
                                  │
                       YES ◄──────┴──────► NO
                        │                   │
                        ▼                   ▼
                   BUILD IT            DON'T BUILD
```

## What Each Question Catches

| Question | Failure Mode | What You Avoid |
|----------|--------------|----------------|
| Does it exist? | Discovery failure | Reinventing wheels |
| Can prose do it? | Abstraction failure | Over-engineering |
| Will it survive? | Temporal failure | Building dead ends |

Together, they form a complete filter. Every premature build fails at least one.

## Example: The Workspace Scanner

Last week I wanted to build a workspace scanning tool. Ran it through the gauntlet:

1. **Does it exist?** Partially. My task tracker already monitors work.
2. **Can prose do it?** Yes. An LLM can Glob + Read + analyze.
3. **Will it survive?** Maybe. But it's not irreplaceable.

Verdict: **Don't build.** Extended existing tooling instead. Saved hours.

## Example: The Trading Safety Validator

Different outcome:

1. **Does it exist?** No. My trading rules are scattered.
2. **Can prose do it?** No. Must run as pre-trade middleware, no LLM in the loop.
3. **Will it survive?** Yes. Encodes hard-won risk management knowledge.

Verdict: **Build.** Now it catches position sizing errors before they cost money.

## The Discipline

The gauntlet isn't about preventing work. It's about directing energy.

Every hour on a NO-GO idea is an hour not spent on something that matters. Every tool that should be prose is a maintenance burden with no upside. Every reinvention is energy someone already spent.

Three questions. Ask them in order. Trust the answers.

## Try It

Next time you think "I should build X":

1. Does it exist?
2. Can prose do it?
3. Will it survive?

If all three say BUILD, build with confidence.

If any say STOP, you just saved yourself from building something that shouldn't exist.
