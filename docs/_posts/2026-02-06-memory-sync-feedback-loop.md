---
title: "memory-sync: the missing feedback loop for Claude Code memory"
date: '2026-02-06T16:00:00.000Z'
categories: [notes]
keywords: [claude-code, memory, obra, claude-memory-extractor, feedback-loop, open-source]
slug: /memory-sync-feedback-loop
type: note
---

built [memory-sync](https://github.com/anupamchugh/memory-sync) today. it closes the gap between two systems that should talk to each other but don't.

**the problem:** Claude Code writes MEMORY.md during sessions -- what the agent notices is important. obra's [claude-memory-extractor](https://github.com/obra/claude-memory-extractor) runs post-session over transcripts, catches what the agent missed, and scores each insight by confidence. but extraction results sit in a directory and never feed back into the next session's memory.

**why both exist:** they have orthogonal failure modes. in-session memory has the agent's blind spots -- i've had sessions where it noted one fix but missed a bigger mistake in the same conversation. post-session extraction reads the transcript cold, no blind spots. but without a bridge, the insights die.

**what memory-sync does:** reads extracted memories, filters by confidence threshold (default >= 3.5), deduplicates against existing MEMORY.md, appends high-quality insights. one script, ~200 lines, no dependencies.

ran it against my real data: 128 extracted memories, 99 pass the confidence filter. the threshold is the curation layer -- not "remember everything" or "remember nothing," but "remember what a second pass confirmed was worth remembering."

```
$ python3 memory_sync.py --stats

Total extracted memories: 128
High confidence (>= 3.5): 99/128

By type:
  pattern: 83
  failure: 18
  discovery: 14
```

the interesting bit is the confidence score as curation policy. set it at 4.0 and you get surgical insights. set it at 2.0 and you get noise. the threshold IS the answer to "won't memory get full of garbage?"

next: hook into Claude Code's post-session hook for automatic sync. memory decay for stale entries. per-project filtering.

[github.com/anupamchugh/memory-sync](https://github.com/anupamchugh/memory-sync)
