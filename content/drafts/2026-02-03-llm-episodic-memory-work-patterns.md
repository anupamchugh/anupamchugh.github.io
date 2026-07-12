---
title: "Mining My Claude Sessions: 7 Days of Work Patterns"
date: 2026-02-03
draft: true
tags: ["claude", "llm", "productivity", "data-analysis"]
---

# Mining My Claude Sessions: 7 Days of Work Patterns

I spent the last week building a system to extract insights from my Claude Code sessions. Here's what I learned about my own work patterns - and whether building this tool makes sense.

## The Raw Data

Claude Code stores every conversation in `~/.claude/projects/` as JSONL files. I have:

| Metric | Value |
|--------|-------|
| Sessions (7 days) | 2,015 |
| Messages | 134,583 |
| Avg messages/session | 66 |
| Subagent sessions | 1,554 (77%) |

**77% of my sessions are subagents.** Claude spawns helper agents for parallel work, and I apparently lean heavily into this pattern.

## Work Hours: I'm a Night Owl

```
Hour  Activity (messages)
────────────────────────────────
00    ░░░         661
01    ██░         2,325
02    ████        6,167
03    ████████    11,836  ← PEAK
04    ███████     10,335
05    ████████    11,299  ← PEAK
06    ███████     10,294
07    ███████     10,805
08    █████       7,382
...
```

My peak productivity is **3am-8am IST**. That's when I do deep work - late night/early morning when interruptions are zero.

## Tool Usage: CLI-Heavy Developer

```
Bash     ████████████████████ 9,914 (37%)
Read     ██████████           5,339 (20%)
Edit     ████                 2,214 (8%)
Grep     ███                  1,596 (6%)
Write    ██                   1,087 (4%)
```

37% of my tool usage is Bash. I'm running commands, not just reading/editing files. This suggests I should optimize for CLI workflows.

## Skill Invocations: Framework-Driven

```
yegge                          43
superpowers:brainstorming      26
superpowers:systematic-debug   16
jesse-vincent-design           11
gauntlet                       11
```

I invoke **Yegge's survival framework 43 times in a week**. I'm constantly asking "will this survive?" before building anything. This is deliberate - I've internalized the philosophy that most software dies.

## Extracted Memories: What I Keep Learning

My memory extraction system (based on [claude-memory-extractor](https://github.com/obra/claude-memory)) has captured 128 lessons. The top themes:

| Theme | Examples |
|-------|----------|
| **Meta-extraction** | "Know when NOT to extract", "Filter chunks first" |
| **MCP patterns** | "Jesse Vincent pattern", "Global vs per-project config" |
| **Workflow discipline** | "Apply frameworks BEFORE building", "Test after build" |
| **Context management** | "Check reference impl early" |

## The Gauntlet: Should I Build LEM?

I ran my "three philosophers" evaluation on this LLM Episodic Memory idea:

### Yegge (Survival)

| Lever | Score | Reason |
|-------|-------|--------|
| Insight Compression | ✅ High | Confidence scoring + multi-dimensional analysis is hard-won knowledge |
| Substrate Efficiency | ✅ High | Local shell analysis uses 0 tokens; LLM only for synthesis |
| Broad Utility | ✅ High | Any AI coding user re-learns lessons |
| Publicity/Awareness | ⚠️ Medium | Needs docs, community |
| Friction | ✅ Low | `lem digest` is one command |
| Human Coefficient | ⚠️ Medium | Humans want to see their patterns |

**Survival Ratio: Above 1.0 - SURVIVES**

### Jesse Vincent (Form)

**Three Gates:**
1. Can prose do this? → NO (needs session parsing, SQLite queries)
2. Needs to run without Claude? → YES (local analysis, cron digests)
3. Friction unbearable without code? → YES (manual grep is tedious)

**Verdict: 💻 CODE (MCP tool + CLI)**

### Dicklesworthstone (Overlap)

**Existing tools:**
- `coding_agent_session_search` (CASS, 429★) - Full-text + semantic search over sessions
- `cass_memory_system` (208★) - Persistent agent memory

**Gap Analysis:**

| Feature | CASS | LEM |
|---------|------|-----|
| Session search | ✅ Full-text + semantic | ✅ |
| Confidence scoring | ❌ | ✅ NEW |
| Multi-dimensional extraction | ❌ | ✅ NEW |
| Trigger matching | ❌ | ✅ NEW |
| Memory digest | ❌ | ✅ NEW |
| Local stats (zero tokens) | ❌ | ✅ NEW |

**Verdict: 🟢 GO - LEM adds confidence scoring and proactive surfacing that CASS doesn't have**

## Unified Verdict

```
┌─ GAUNTLET VERDICT ──────────────────────────────────┐
│ Subject: LLM Episodic Memory (LEM)                  │
├─────────────────────────────────────────────────────┤
│ YEGGE: ✅ SURVIVES (4/6 levers strong)              │
│ JESSE: 💻 CODE (needs MCP + CLI)                    │
│ DICKLE: 🔧 Partial overlap with CASS                │
├─────────────────────────────────────────────────────┤
│ UNIFIED VERDICT: 🟢 GO                              │
│                                                     │
│ Build LEM as:                                       │
│ 1. CLI tool for local stats (zero tokens)          │
│ 2. MCP server for extraction/query                 │
│ 3. Integrate with CASS for search                  │
│                                                     │
│ Differentiator: Confidence scoring + digests       │
└─────────────────────────────────────────────────────┘
```

## Token-Efficient Architecture

The key insight: **90% of insights from 10% of tokens**.

Most analysis needs ZERO LLM calls:

```bash
# Session count - zero tokens
find ~/.claude/projects -name "*.jsonl" -mtime -7 | wc -l

# Tool usage - zero tokens
grep '"type":"tool_use"' *.jsonl | grep -o '"name":"[^"]*"' | sort | uniq -c

# Hour distribution - zero tokens
grep '"timestamp"' *.jsonl | cut -dT -f2 | cut -d: -f1 | sort | uniq -c
```

Only call Claude for:
1. Synthesizing digest (~2k tokens)
2. Deep extraction of high-signal sessions (~5k tokens)

## Recommendations for My Workflow

Based on this analysis:

1. **Leverage 3am-8am** - Queue complex tasks for peak hours
2. **Optimize subagent spawning** - 77% of sessions are subagents, worth optimizing
3. **Extract Yegge patterns** - 43 invocations but no memories about survival insights
4. **Add MCP debugging memories** - Journal shows issues, no extracted prevention strategies

## CASS: The Search Layer Already Exists

Before building anything, I checked if someone had already solved this. [CASS](https://github.com/Dicklesworthstone/coding_agent_session_search) (Coding Agent Session Search) by Dicklesworthstone has 429★ and does multi-provider session search.

My CASS index shows:
```
Conversations:  12,332
Messages:       195,106

By Agent:
  claude_code:  11,659 (94.5%)
  codex:           575 (4.7%)
  gemini:           98 (0.8%)
```

Example searches that work right now:
```bash
# Find MCP caching discussions across Claude + Codex
cass search "MCP caching" --robot --limit 5

# Find Jesse Vincent philosophy discussions
cass search "Jesse Vincent" --robot --limit 5
```

**CASS solves finding. LEM adds learning.**

## HN Gap: Nobody's Doing This

I searched HN for anyone writing about this concept:

| Search | Results |
|--------|---------|
| "LLM memory extraction learning" | 0 |
| "AI conversations insights extract" | 0 |
| "coding assistant persistent lessons" | 0 |

The only relevant post is CASS itself (Dec 2025, 3 points). **The space is wide open.**

## Next Steps

1. ✅ Built `lem-stats.sh` (local shell script, zero tokens)
2. Build `lem digest` (one LLM call for synthesis)
3. Integrate with CASS for search (don't reinvent)
4. Add to session-end workflow
5. **Write the HN post** (first-mover advantage)

---

*This post was generated by analyzing 2,015 Claude sessions and 134,583 messages from the last 7 days. CASS provided cross-agent search verification.*
