# Notes: The Memory Feedback Loop Problem

**Date:** 2026-02-06
**Repo:** https://github.com/anupamchugh/memory-sync
**Context:** Built after analyzing HN discussion on Claude Opus 4.6 memory features

---

## The Observation

Claude Code's MEMORY.md and obra's claude-memory-extractor aren't competing. They have orthogonal failure modes.

**In-session memory** (MEMORY.md) is agent-written. It captures what the agent notices while working. The problem: systematic blind spots. I had a session where it carefully noted a broken CSS selector but completely missed that it was calling a non-existent API endpoint — a different process reviewing the transcript caught both.

**Post-session extraction** (obra's tool) runs over conversation transcripts afterward. Finds recurring mistakes, implicit preferences, debugging strategies. Uses confidence scoring (1-5). Doesn't need the agent to notice anything.

The circularity problem ("agent needs to remember to remember") is real for in-session memory. Post-session extraction sidesteps it entirely.

## The Gap

These systems are disconnected:

```
Session N:  Agent writes MEMORY.md (blind spots included)
Post-session: Extractor writes ~/.claude/memories/extracted/ (catches blind spots)
Session N+1: Agent reads MEMORY.md (extraction insights NOT included)
```

The extracted insights never feed back. They sit in a directory nobody reads.

## The Fix: memory-sync

One script. ~200 lines. No dependencies.

```
~/.claude/memories/extracted/*.md  -->  memory-sync  -->  MEMORY.md
```

What it does:
1. Reads extracted memories (confidence-scored by obra's tool)
2. Filters by threshold (default >= 3.5) — this is the curation layer
3. Deduplicates against existing MEMORY.md
4. Appends, respecting the 200-line limit

## Stats From My Real Data

```
Total extracted memories: 128
High confidence (>= 3.5): 99/128 (77%)

By type:
  pattern: 83
  failure: 18
  discovery: 14
  rule: 6
  workflow: 6
```

The confidence threshold solves the bloat problem people worry about. Not "remember everything" or "remember nothing" — remember what a second pass confirmed was worth remembering.

## The Philosophical Bit

Two systems with orthogonal failure modes:

| System | Writes When | Blind Spot |
|--------|-------------|------------|
| MEMORY.md | Agent notices something | Agent's own mistakes |
| Extractor | Cold transcript review | Nothing (reads everything) |

The interesting question isn't "which is better" — it's "what does the feedback loop look like?" When extraction results improve in-session memory, you get compounding returns: better memory → better sessions → better extractions → better memory.

The confidence score is the underrated piece. It's not just a number — it's a curation policy. Set it at 4.0 and you get surgical insights. Set it at 2.0 and you get noise. The threshold IS the answer to "won't memory get full of garbage?"

## What's Next

- Hook into Claude Code's post-session hook for automatic sync
- Per-project filtering (only sync memories tagged for that project)
- Memory decay: lower confidence of old entries that haven't been triggered
- Consolidation: merge similar memories instead of accumulating duplicates
