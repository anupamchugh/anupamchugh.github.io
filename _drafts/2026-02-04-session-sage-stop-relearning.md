---
layout: post
title: "Session Sage: Stop Your AI Agents From Re-Learning the Same Lessons"
date: 2026-02-04
categories: [ai, tools, productivity]
tags: [claude, llm, memory, coding-agents]
draft: true
---

Last week, Claude suggested `time.sleep()` in async code. I corrected it. Two days later, different session, same mistake. The lesson was lost.

If you use AI coding agents heavily, you've felt this pain. Every session starts fresh. Every lesson evaporates. Your agent has goldfish memory.

I've been using Claude Code, Codex, and Cursor for months now. I have **12,000+ sessions** across these tools. That's a lot of learned wisdom—scattered, unsearchable, and forgotten.

So I built Session Sage.

## The Problem Nobody's Solving

There are tools for searching your AI sessions. [CASS](https://github.com/Dicklesworthstone/coding_agent_session_search) by Dicklesworthstone is excellent—fast Rust-based search across Claude, Cursor, Codex, and more.

But search finds *text*. It doesn't extract *lessons*.

There are also memory layers like Sovant and Grov that give agents persistent context. But they're focused on sharing decisions across teams, not extracting what you've learned.

What's missing is something that answers: **"What have I learned that I keep forgetting?"**

## What Session Sage Does

Session Sage extracts **transferable lessons** with confidence scores:

```yaml
lesson: "Never use time.sleep() in async code - use await asyncio.sleep()"
confidence: 4.5/5
triggers: ["async", "sleep", "blocking"]
source: session-2026-02-01-abc123
extraction_method: correction_detected
```

The key insight: not everything is worth remembering. Low-confidence extractions are flagged, not blindly trusted.

### Multi-Dimensional Analysis

When you correct Claude, what actually happened? Session Sage analyzes three dimensions:

**Root Cause (Five Whys):**
- Surface: Test passes, production fails
- ↓ Why? Different execution timing
- ↓ Why? Mocked async vs real async
- ↓ Why? Integration test didn't simulate real concurrency
- **Root:** Testing strategy didn't match production execution model

**Psychological Driver:**
- What was the agent trying to achieve? (Ship faster)
- What fear drove this? (Integration tests are slow/flaky)
- What need is being served? (Confidence without cost)

**Prevention Strategy:**
```
BEFORE concluding "code is correct, environment is wrong":
  Check: "Did I compare execution paths in both contexts?"
  If NO: Add logging to trace actual execution order
```

This is inspired by Jesse Vincent's [claude-memory](https://github.com/obra/claude-memory) research, which achieved 85% match to human ground truth on lesson extraction.

### Trigger Matching (Proactive Memory)

The real magic isn't querying memories—it's having them surface automatically.

When you start working on auth code, Session Sage notices and says: "Hey, you've learned 3 things about JWT handling. Want me to remind you?"

```python
relevant = lem.match_triggers({
    "files": ["auth.py", "jwt_utils.py"],
    "task": "add token refresh logic"
})
# Returns:
# [
#   Memory("JWT vs Session debate", confidence=4.5),
#   Memory("Always validate expiry before refresh", confidence=4.0)
# ]
```

This is the difference between a notebook and a mentor.

### Universal Format

I don't just use Claude. I use ChatGPT for some things, Cursor for others. Session Sage works with all of them through a Universal Session Format (USF):

```bash
lem ingest claude           # ~/.claude/projects/
lem ingest chatgpt export.json
lem ingest cursor
```

One memory store. All your agents.

### Zero-Token Local Stats

Most analysis doesn't need an LLM at all. Session Sage includes `lem stats`—pure local analysis:

```
SESSION ACTIVITY (Last 7 days)
Total sessions:    147
Total messages:    9,823
Avg per session:   66

TOP PROJECTS
a Python/FastAPI project:  89
specbeads:              23
claude-memory:          18

WORK HOURS
03:00  ████████████████  2,341
04:00  ████████████████  2,156
10:00  ████              612
```

Zero tokens. Instant. Your work patterns, revealed.

## How It Compares

| Feature | CASS | Grov | Session Sage |
|---------|------|------|--------------|
| **Purpose** | Find text | Share decisions | Extract lessons |
| **Confidence scoring** | ❌ | ❌ | ✅ (1-5 scale) |
| **Multi-dimensional analysis** | ❌ | ❌ | ✅ |
| **Trigger matching** | ❌ | ❌ | ✅ |
| **Query language** | ✅ | ❌ | ✅ (LEM-QL) |
| **Multi-provider** | ✅ | ✅ | ✅ |
| **Zero-token stats** | ❌ | ❌ | ✅ |

**The positioning:** CASS is grep for your sessions. Session Sage is the lessons you wish you'd written down.

In fact, Session Sage *uses* CASS under the hood for search. Why rebuild what already works?

## Integration with Shadowbook

I'm also building [Shadowbook](https://github.com/anupamchugh/shadowbook) (specbeads)—a drift detection tool for specs, skills, and beads.

The two tools complement each other:

| Shadowbook | Session Sage |
|------------|--------------|
| Detects drift | Explains why drift happened |
| "Spec X changed" | "Spec X drifted because Y" |
| Preflight checks | Surfaces relevant memories |

The integration:

```bash
# Shadowbook detects drift, Session Sage records the lesson
bd spec scan --on-drift "lem record --type drift"

# Session Sage queries can include Shadowbook context
lem query "auth" --include-shadowbook
```

**Phase 1 (Now):** Separate tools, integration via hooks
**Phase 2 (Later):** Shared core library if both mature

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Session Sage (LEM)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │ Session  │    │ Extract  │    │ Memory   │    │ Query    │ │
│  │ Ingest   │───▶│ Engine   │───▶│ Store    │───▶│ Engine   │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│       │              │                │               │        │
│       ▼              ▼                ▼               ▼        │
│  Claude/GPT/     Multi-dim       Git-backed      Trigger      │
│  Cursor/Copilot  Analysis       + SQLite        Match +       │
│                                                  Digest        │
└─────────────────────────────────────────────────────────────────┘
```

**Storage:** Git-backed JSONL (mergeable, auditable) + SQLite cache (fast queries). Same pattern as [beads](https://github.com/steveyegge/beads).

**Query Language (LEM-QL):**
```sql
SELECT * FROM memories
WHERE confidence >= 4.0
  AND 'debugging' IN tags
ORDER BY created DESC;
```

**MCP Server:** Expose as tools for Claude Code integration:
```python
@mcp.tool
async def lem(action: str, query: str = None):
    """query | search | triggers | extract | digest | stats"""
```

## Why This Will Survive

Using [Yegge's survival framework](https://www.youtube.com/watch?v=oJi0t8-ZBOY):

| Lever | Score | Why |
|-------|-------|-----|
| Friction | 8/10 | `lem extract` is one command |
| Awareness | 7/10 | MCP integration surfaces in agent |
| Savings | 9/10 | Stop re-learning same lessons |
| Usage | 8/10 | Every session is potential input |

**Survival odds: 8/10**

The core value proposition: every AI user re-learns the same lessons. Session Sage stops that.

## Current Status

- **Spec:** Complete
- **lem-stats.sh:** Working (zero-token local analysis)
- **CASS integration:** Verified (195k messages indexed)
- **Building:** Now

## What I'd Love Feedback On

1. What lessons do YOU wish your agents remembered?
2. How do you currently handle cross-session context?
3. Would you prefer confidence scores shown inline, or only on request?

---

*"The best AI memory is the one that knows what's worth remembering."*

**GitHub:** [Coming soon]

**Related:**
- [CASS](https://github.com/Dicklesworthstone/coding_agent_session_search) - Session search (we integrate with this)
- [claude-memory](https://github.com/obra/claude-memory) - Multi-dimensional extraction (inspiration)
- [beads](https://github.com/steveyegge/beads) - Task tracking (complementary)
- [Shadowbook](https://github.com/anupamchugh/shadowbook) - Drift detection (integrates with Session Sage)
