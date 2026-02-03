---
draft: true
title: "Death by a Thousand If-Statements"
date: '2026-02-03T12:00:00.000Z'
categories: [ai, software-engineering, patterns]
keywords: [ai-agents, code-quality, design-patterns, guards, validation, mental-models]
slug: /death-by-a-thousand-if-statements
published: false
---
draft: true

*A Mental Model to Stop Your AI From Scattering Guards*

---
draft: true

You ask your AI coding agent to fix a bug. Invalid data is reaching the database. The agent traces the call stack, finds the insertion point, adds a validation check. The fix is correct. The tests pass.

Two weeks later, the same invalid data appears. Different code path, same symptom. The agent adds another check. Correct again. Tests pass again.

A month in, your codebase has seventeen validation checks scattered across nine files. Each check is locally correct. Each was the right fix for the bug in front of the agent. Together, they form a distributed validation system that nobody designed—and that still leaks.

This is the failure mode of local reasoning applied to a systemic problem.

The agent isn't broken. It's optimizing for the wrong objective: *fix this bug* rather than *prevent this class of bugs*. It lacks a mental model for where guards belong in a system.

When engineers notice this pattern, they typically reach for one of three strategies:

1. **Guard at the source** — find the root producer of bad data and validate there
2. **Filter at entry** — reject bad data at system boundaries before it propagates
3. **Composable wrappers** — extract validation into reusable decorators or middleware

Each strategy has theoretical justification. Each, applied in isolation, still leaks. The bug resurfaces through whichever layer you didn't protect.

The insight isn't choosing the right strategy. It's recognizing that these three strategies operate at different layers—and a robust system needs all of them.

---
draft: true

## The Three Layers

### Layer 1: Guard at the Source

The most intuitive fix. Find where bad data originates and stop it there.

```python
async def fetch_resource(resource_id: str, resource_type: str) -> Optional[Data]:
    """Fetch data with guard at the source."""

    # Guard at the lowest layer - one place, not seventeen
    if not is_valid_resource(resource_id, resource_type):
        return None  # Silent return, no exception propagation

    return await _do_fetch(resource_id, resource_type)
```

The principle: **every code path that fetches data flows through this function**. Guard here, guard once.

Why it's incomplete: What about data that's already in the system? What about resources that were valid yesterday but aren't today? The source guard only protects new fetches—it doesn't filter what's already inside.

---
draft: true

### Layer 2: Filter at Entry

Bad data shouldn't enter the system in the first place. Pre-filter at the boundary.

```python
def get_active_resources(collection_name: str) -> list[str]:
    """Load resources, filtering invalid ones at entry."""

    resources = load_collection(collection_name)

    # Pre-filter: invalid resources never enter the pipeline
    active = []
    filtered_count = 0

    for resource in resources:
        if not is_valid_resource(resource):
            filtered_count += 1
            continue
        active.append(resource)

    if filtered_count > 0:
        logger.debug(f"Filtered {filtered_count} invalid from {collection_name}")

    return active
```

The principle: **invalid resources never appear in working sets**. Downstream code doesn't need to check—the input is already clean.

Why it's incomplete: You can't pre-filter everything. Some resources become invalid after loading. Some code paths bypass the collection loader. Entry filtering reduces surface area but doesn't eliminate it.

---
draft: true

### Layer 3: Composable Wrappers

Extract the guard into a reusable primitive. Apply it anywhere without scattering logic.

```python
from functools import wraps

def with_validity_guard(resource_type: str):
    """Decorator: block operations on invalid resources."""

    def decorator(fn):
        @wraps(fn)
        async def guarded(resource_id: str, *args, **kwargs):
            if not is_valid_resource(resource_id, resource_type):
                return None
            return await fn(resource_id, *args, **kwargs)
        return guarded
    return decorator


# Apply to any function that touches resources
@with_validity_guard("document")
async def process_document(doc_id: str) -> Result:
    return await _process(doc_id)

@with_validity_guard("document")
async def sync_document(doc_id: str) -> Result:
    return await _sync(doc_id)
```

The principle: **the guard is a composable primitive**, not copy-pasted code. New functions get protection with one line.

Why it's incomplete: Decorators are opt-in. Someone writes a new function, forgets the decorator, bug reappears. Composability reduces friction but requires discipline.

---
draft: true

## The Synthesis

### Why Each Layer Alone Fails

| Layer | What It Catches | What It Misses |
|-------|-----------------|----------------|
| Source guard | New fetches of invalid resources | Resources already in system; data that became invalid after loading |
| Entry filter | Invalid resources in collections | Direct references bypassing collections; dynamically-added resources |
| Composable wrapper | Any wrapped function | Unwrapped functions; new code without decorator |

Each layer has blind spots. The bug resurfaces through whichever layer you didn't protect.

---
draft: true

### The Three-Layer Defense

Apply all three:

```
┌─────────────────────────────────────────────────────────┐
│                    REQUEST COMES IN                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: ENTRY FILTER                                  │
│  get_active_resources() → pre-filtered collection       │
│  Invalid resources never enter working set              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: COMPOSABLE WRAPPER                            │
│  @with_validity_guard on business logic                 │
│  Catches direct references that bypassed entry          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: SOURCE GUARD                                  │
│  fetch_resource() → final check before I/O              │
│  Last line of defense; nothing invalid hits external    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL SYSTEM                         │
│              (Database, API, File System)                │
└─────────────────────────────────────────────────────────┘
```

Invalid data must pass three independent checks. A single failure mode no longer compromises the system.

---
draft: true

### Why AI Agents Can't Discover This

An AI coding agent optimizes for *the bug in front of it*. When it sees invalid data reaching the database, it traces the call stack, finds an unguarded path, and adds a check. Correct behavior, wrong layer.

The agent lacks two things:

**1. Architectural awareness.** It doesn't know that `fetch_resource()` is the canonical data retrieval function. It sees *a* function that fetches data, not *the* function that all paths should use.

**2. The three-layer mental model.** It doesn't know that guards belong at entry, wrapper, and source. It knows a guard is needed *somewhere*. It picks the first viable location.

The result is scattered guards—locally correct, globally incoherent.

---
draft: true

### The Human's Job: Provide the Mental Model

You can't expect the agent to discover this pattern. You provide it:

```markdown
## Guard Placement Rules

All validity checks follow the three-layer pattern:

1. **Entry**: `get_active_resources()` pre-filters collections
2. **Wrapper**: `@with_validity_guard` decorates business logic
3. **Source**: `fetch_resource()` checks before external calls

When adding a new validity check:
- If it's a collection → add to entry filter
- If it's a function → apply the decorator
- If it's a fetch → it should already be guarded at source

Do NOT add inline if-statements. Use the existing guards.
```

Put this in your project's contributing guidelines, architecture docs, or AI context file. The agent reads it, follows it, and stops scattering guards.

---
draft: true

## Practical Takeaways

### The Pattern, Compressed

Three guards, three layers, one principle: defense in depth for data validity.

```python
# Layer 1: Entry
def get_resources(collection: str) -> list[str]:
    return [r for r in load(collection) if is_valid(r)]

# Layer 2: Wrapper
def with_guard(fn):
    def wrapped(resource_id, *args):
        if not is_valid(resource_id):
            return None
        return fn(resource_id, *args)
    return wrapped

# Layer 3: Source
async def fetch(resource_id: str) -> Data | None:
    if not is_valid(resource_id):
        return None
    return await _fetch(resource_id)
```

Thirty lines. The entire pattern.

---
draft: true

### When You Need This

Not every system does. The pattern applies when:

1. **Resources have validity states that change over time.** Subscriptions expire. Tokens rotate. Cache entries go stale. If validity is static, a single check suffices.

2. **Multiple code paths touch the same resources.** One entry point means one guard. Ten entry points means scattered guards—or this pattern.

3. **You're working with AI coding agents.** Agents add guards where they find bugs. Without architectural guidance, they'll scatter. Give them the mental model or accept the mess.

---
draft: true

### What Changes in Your Codebase

Adopting this pattern requires three additions:

**1. A canonical validity function.**

```python
def is_valid_resource(resource_id: str, resource_type: str) -> bool:
    """Single source of truth for resource validity."""
    # Your logic here
```

Every guard calls this. No inline validity checks. One function to update when requirements change.

**2. A decorator for business logic.**

```python
@with_validity_guard("document")
async def process_document(doc_id: str) -> Result:
    ...
```

New functions get the decorator. Code review catches missing decorators. The guard is opt-in but visible.

**3. Documentation that encodes the pattern.**

```markdown
## Adding Validity Checks

Use the three-layer pattern. Do not add inline if-statements.
```

This is the part AI agents read. Make it explicit.

---
draft: true

### The Cost

Nothing is free.

**Performance:** Three validity checks per operation. If `is_valid()` hits the database, you're tripling queries. Solution: cache validity state, or make the check cheap (in-memory lookup, timestamp comparison).

**Complexity:** New engineers must learn the pattern. Three layers is more cognitive load than one. Solution: document it, enforce it in review, make the decorator obvious.

**False sense of security:** Three layers doesn't mean bulletproof. If `is_valid()` has a bug, all three layers inherit it. Solution: test the validity function thoroughly.

The tradeoff is worth it when scattered guards cost more than structured ones. In my experience, that threshold is around five guards. Below five, inline checks are fine. Above five, you're building a distributed validation system whether you intended to or not. Better to design it.

---
draft: true

## Closing

The bug that prompted this pattern was mundane. Invalid data reaching a database. The fix took three attempts: first a guard at the call site, then another guard upstream, then a decorator that still missed edge cases.

The fourth attempt was stepping back and asking: where *should* guards live in this system?

The answer wasn't one location. It was three. Entry, wrapper, source. Each catches what the others miss.

If you're fixing the same class of bug repeatedly, you're not missing a guard. You're missing a mental model.

Build the model. Encode it in your architecture. Hand it to your tools—human or otherwise.

The scattered if-statements will stop.
