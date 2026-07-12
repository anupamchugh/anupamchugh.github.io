---
title: "A 3k-Token ASCII Mockup Prevents a 25k-Token Rewrite"
date: 2026-02-06
draft: true
tags: ["agentic-coding", "claude", "mitchellh", "workflow", "llm", "token-efficiency"]
---

# A 3k-Token ASCII Mockup Prevents a 25k-Token Rewrite

I asked my AI agent to restructure a dashboard. It had 51 items rendering as individual cards — visual chaos. The plan was clear: group them by category, show active items as compact table rows, collapse completed ones into a log.

The agent read two files, wrote 400 lines of code across CSS + JavaScript + Python, validated syntax, and reported "done."

One problem: halfway through, I realized I had a design question. Should completed items be hidden entirely, or collapsed but expandable? By the time I asked, the code already assumed "collapsible trail log." If my answer had been "remove them" — half the frontend code would be wasted.

This is the most expensive mistake in agentic coding. Not bugs. Not wrong algorithms. **Building the right thing in the wrong shape.**

## What Mitchell Hashimoto Would Say

Hashimoto's [AI adoption journey](https://mitchellh.com/writing/my-ai-adoption-journey) describes six steps from chatbot to continuous agents. Step 2 is the one most people skip: **reproduce your own work manually first.** His corollary: separate planning from execution sessions, and let agents verify their own output.

Applied to UI work, this means: **show the shape before building the thing.**

## The Two Workflows

### What Actually Happened

```
Human: "Here's a plan. Implement it."
    |
Agent: reads 2 files, writes 400 lines
    |
Human: "Wait — should completed items be removed or collapsed?"
    |
Agent: "I already built the collapsible version..."
    |
Result: Code works, but design question arrived too late.
         If answer was different → rework.
```

**Cost: ~25,000 output tokens. Rework risk: high.**

### What Should Have Happened

```
Human: "Here's a plan. Implement it."
    |
Agent: reads 2 files, shows ASCII mockup:

    +-- ITEM_GROUP  TYPE:A  LTP: $130.50  QTY: 4615 -----+
    | 35 active | 9 completed                              |
    |                                                       |
    | ID      ENTRY    TARGET   QTY  P&L    STATUS         |
    | ...8692 $130.70  $133.31   65  +1.2%  WAITING        |
    | ...9828 $130.05  $132.65   65  +0.8%  WAITING        |
    |                                                       |
    | > COMPLETED LOG - 9 items (collapsed by default)      |
    +-------------------------------------------------------+
    |
Human: "Yes, collapsed is right. But add the entry range bar."
    |
Agent: NOW writes 400 lines with confidence
    |
Result: Code matches intent. No rework.
```

**Cost: ~3,000 tokens for mockup + ~15,000 tokens for approved code. Rework risk: near zero.**

## Why This Works (The Math)

An ASCII mockup is cheap to produce and cheap to iterate on:

| Phase | Tokens | Rework risk |
|-------|--------|-------------|
| Read files | 2,000 | - |
| Generate ASCII mockup | 1,000 | - |
| Human reviews, gives feedback | 0 (human) | - |
| Revised mockup (if needed) | 500 | - |
| **Subtotal before code** | **3,500** | **Near zero** |
| Write implementation | 15,000 | Low (shape is approved) |
| **Total** | **18,500** | **Low** |

Compare to the "just build it" approach: 25,000 tokens with a coin-flip on whether the shape is right. If wrong, you're looking at 25,000 more tokens for the rewrite.

**Expected cost with mockup: 18,500 tokens.**
**Expected cost without mockup: 25,000 + (0.3 x 25,000) = 32,500 tokens.**

That 30% rework probability is conservative. For UI work where "I'll know it when I see it" is the norm, it's closer to 50%.

## The Skill That Enforces This

After this experience, I created a skill called `shape-before-code`. It fires whenever the agent is about to write UI code, HTML, or any visual output over 10 lines.

The rule is simple:

1. Read the existing code
2. Show an ASCII mockup (under 30 lines)
3. Wait for approval
4. Only then write implementation

The mockup doesn't need to be pretty. Boxes, pipes, and dashes are fine. The point is **structure** — what's grouped with what, which columns appear, what's collapsed vs expanded, what's prominent vs secondary.

## Hashimoto's Ladder Applied

This maps directly to Hashimoto's framework:

| Step | What it means here |
|------|-------------------|
| Step 2: Reproduce manually | Show the mockup — it's the "manual reproduction" of the UI |
| Step 4: Delegate slam dunks | Backend data grouping = slam dunk (delegate freely). UI shape = needs human eye |
| Step 5: Engineer the harness | The `shape-before-code` skill IS the harness — every failure produces a rule |

The key insight from Step 5: **every agent failure should produce a concrete artifact.** Not a journal entry. Not a mental note. A rule, a skill, or an AGENTS.md update that prevents the same failure next time.

My mid-flight design question wasn't a communication failure. It was a missing checkpoint that should have been automated. Now it is.

## When to Use This

**Always use mockups for:**
- Dashboard layouts
- Table/grid restructures
- Any grouped data display
- Navigation changes
- Form layouts

**Skip mockups for:**
- Pure logic changes (no visual output)
- Bug fixes to existing layouts
- Adding a single field to an existing view
- Backend-only changes

## The A/B Test

The real-time monitoring dashboard was built twice:
- **V1 (Organic)**: Jump to code, fix bugs as they appear. Result: 183 lines, 11 cycles of bug fixes, 0 tests, 0 rules created. 5 critical bugs discovered in production.
- **V2 (Hashimoto)**: Manual walkthrough → design doc → classify tasks → code. Result: 97 lines (47% less), 22 tests written before code, 2 rules created. The CRT retro terminal UI with scanline effects.

The Hashimoto approach produced better code with less effort because the thinking happened on paper, not in the codebase. Every edge case (inverted math for opposite-direction instruments, fallback data sources when real-time feeds drop, peak price tracking) was caught during the manual walkthrough — not after shipping.

## Phase 1 Artifact Became the Product

The most unexpected payoff: the manual trace from Phase 1 — the pen-and-paper walkthrough showing time, prices, state transitions — turned out to be exactly what the UI should display.

```
09:25  25710  LONG ₹138  SHORT ₹122  ▲ LONG ENTRY @ ₹138
09:35  25740  LONG ₹165  SHORT ₹100  ★ LONG PEAK +19.6%
09:50  25700  LONG ₹132  SHORT ₹130  ▼ LONG EXIT @ ₹132 (-4.3%)
       ──────── Peak was +19.6%. Trail missed. ────────
09:55  25685  LONG ₹118  SHORT ₹145  ▲ SHORT ENTRY @ ₹145
```

This isn't a debugging format. This IS the product. A scrolling log of state transitions that tells you the story of a paired instrument replay through a day. The manual walkthrough artifact didn't get thrown away — it became the replay monitor's UI.

That's the deeper Hashimoto insight: **the artifact from Phase 1 (manual walkthrough) should inform the shape of Phase 3 (the product)**. When you walk through something by hand and the trace is readable, the trace format IS your UI.

## The Takeaway

The cheapest line of code is the one you never write. The cheapest UI iteration is the one that happens in ASCII before a single `div` is created.

Show the shape. Get the nod. Then build.

---

*This post was written after a real session where I watched an AI agent build exactly the right feature in exactly the wrong shape. The fix wasn't better prompting — it was a 30-line ASCII checkpoint that costs 3,000 tokens and saves 25,000.*
