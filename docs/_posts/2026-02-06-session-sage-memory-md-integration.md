---
title: "Claude Code ships auto-memory. here's how to make it smart."
date: '2026-02-06T18:00:00.000Z'
categories: [notes]
keywords: [claude-code, memory, session-sage, lem, confidence-scoring, open-source]
slug: /session-sage-memory-md
type: note
published: true
---

Claude Code 2.1.32 added auto-memory. every session, Claude reads a flat markdown file, writes notes during work, and loads them next time. it's a 200-line notepad with no structure, no scoring, no curation.

[Session Sage](https://github.com/anupamchugh/session-sage) now plugs into it. three new commands:

**`lem ingest`** — discovers all `~/.claude/projects/*/memory/MEMORY.md` files, parses sections, scores confidence heuristically (1-5), deduplicates via blake3, stores in SQLite FTS.

**`lem curate`** — ranks memories by `(confidence × 0.4 + recency × 0.3 + relevance × 0.3)`, picks top N within the 200-line budget, writes categorized markdown back to memory.md.

**`lem sync`** — runs ingest then curate. one command for the full loop.

the data flow:

```
Claude writes raw notes → memory.md
                            ↓
                       lem ingest (parse → score → store)
                            ↓
                       lem curate (rank → budget → write)
                            ↓
Claude reads curated memory.md next session
```

what this adds over raw memory.md:

| | memory.md | + LEM |
|--|-----------|-------|
| storage | 200-line flat file | SQLite FTS, unlimited |
| confidence | everything equal | 1-5 scored |
| structure | freeform | categorized (bugs, patterns, anti-patterns) |
| curation | manual | automatic by score |
| cross-project | per-project | centralized store |
| dedup | none | blake3 hash |

feedback loop protection: `lem ingest` skips files with a `<!-- Curated by LEM -->` header. no re-ingesting its own output.

ran it against my real workspace: 3 project memory files → 15 structured memories ingested → curated back with confidence scores and categories. the TOTP selector bug from this morning scored 5.0 (has file paths, fix, and lesson). a vague "some pattern" note scored 2.5. that's the point — not everything is worth the 200-line budget.

Rust CLI. 23 tests. ~400 new lines. no LLM calls for ingest/curate — pure heuristic scoring.

repo: [github.com/anupamchugh/session-sage](https://github.com/anupamchugh/session-sage)
