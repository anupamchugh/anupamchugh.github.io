---
title: "Death by a Thousand If-Statements"
date: '2026-02-03T12:00:00.000Z'
categories: [ai, software-engineering, patterns]
keywords: [ai-agents, code-quality, design-patterns, guards, validation, mental-models, claude-code]
slug: /death-by-a-thousand-if-statements
published: true
---

You ask your AI coding agent to fix a bug. Invalid data reaching the database. The agent traces the stack, finds the gap, adds a validation check. Correct. Tests pass.

Two weeks later, same symptom, different code path. The agent adds another check.

A month in, your codebase has this:

```python
# api/handlers.py
async def handle_request(resource_id):
    if not is_valid_resource(resource_id):  # guard #1
        return error_response()

# core/processor.py
async def process(resource_id):
    if not is_valid_resource(resource_id):  # guard #2 (copy-paste)
        return None

# services/sync.py
async def sync_resource(resource_id):
    if resource_id not in valid_resources:  # guard #3 (different check!)
        return

# jobs/cleanup.py
def cleanup_stale():
    for r in resources:
        if not is_valid(r):  # guard #4 (different function name!)
            continue
```

Four files. Four guards. Three different implementations of the same check. One uses a stale cache. Another calls a different function entirely. Each was the correct fix for the bug that prompted it. Together, they're unmaintainable — and they still leak.

**The agent isn't broken.** It's optimizing for *fix this bug* instead of *prevent this class of bugs*. It lacks a mental model for where guards belong.

---

## The fix is a rule file, not more code

Drop this in your project's `.claude/rules/` or `CLAUDE.md` or wherever your agent reads architectural guidance:

```markdown
## Guard Placement Rules

All validity checks follow the three-layer pattern:

1. **Entry**: `get_active_resources()` pre-filters collections
2. **Wrapper**: `@with_validity_guard` decorates business logic
3. **Source**: `fetch_resource()` checks before external calls

When adding a new validity check:
- Collection? → add to entry filter
- Function? → apply the decorator
- Fetch? → already guarded at source

Do NOT add inline if-statements. Use the existing guards.
```

The difference is immediate. Without the rule:

```python
# Agent adds guard at the call site it found
async def sync_resource(resource_id):
    if not is_valid_resource(resource_id):  # new inline guard
        return
    await _sync(resource_id)
```

With the rule:

```python
# Agent applies the decorator instead
@with_validity_guard("resource")
async def sync_resource(resource_id):
    await _sync(resource_id)
```

Same bug, same agent, different output. The mental model changes the fix from a local patch to a systemic one.

---

## The three-layer pattern (compressed)

Why three layers? Because each one has blind spots the others cover.

| Layer | What it catches | What it misses |
|-------|----------------|----------------|
| **Entry filter** | Invalid items in collections | Direct references bypassing collections |
| **Composable wrapper** | Any decorated function | New functions missing the decorator |
| **Source guard** | Final check before I/O | Data already in the system |

The full pattern in 30 lines:

```python
# Layer 1: Entry — invalid items never enter working sets
def get_resources(collection: str) -> list[str]:
    return [r for r in load(collection) if is_valid(r)]

# Layer 2: Wrapper — business logic gets protection with one line
def with_guard(fn):
    def wrapped(resource_id, *args):
        if not is_valid(resource_id):
            return None
        return fn(resource_id, *args)
    return wrapped

# Layer 3: Source — nothing invalid hits external systems
async def fetch(resource_id: str) -> Data | None:
    if not is_valid(resource_id):
        return None
    return await _fetch(resource_id)
```

All three call the same `is_valid()` function. One source of truth. One place to update when requirements change.

---

## When you need this

Not every system does. Three conditions:

**1. Validity changes over time.** A subscription expires overnight. An API token gets rotated. A cache entry goes stale. If validity is static, one check suffices. If it changes, scattered checks will eventually disagree.

**2. Multiple code paths touch the same data.** One entry point means one guard. Ten entry points means scattered guards — or this pattern.

**3. You're working with AI coding agents.** Agents add guards where they find bugs. Without architectural guidance, they scatter. Give them the model or accept the mess.

---

## The cost

**Performance:** Three checks per operation. If `is_valid()` hits the database, cache it or make it cheap (in-memory lookup, timestamp comparison).

**Complexity:** Three layers is more cognitive load than one. Document it. Make the decorator obvious. Code review catches missing decorators.

**Single point of failure:** If `is_valid()` has a bug, all three layers inherit it. Test it thoroughly.

The tradeoff is worth it when you notice the same validation check appearing in a third file. At that point you're building a distributed validation system whether you intended to or not. Better to design it.

---

## The takeaway

If you're fixing the same class of bug repeatedly, you're not missing a guard. You're missing a mental model.

Build the model. Encode it as a rule file your agent reads. The scattered if-statements stop.
