---
title: "your if-statements have two problems"
date: '2026-02-08T18:00:00.000Z'
categories: [ai, software-engineering, patterns]
keywords: [ai-agents, code-quality, zfc, regex, design-patterns, guards, validation, mental-models, claude-code]
slug: /your-if-statements-have-two-problems
draft: true
published: false
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

Four files. Four guards. Three different implementations of the same check. One uses a stale cache. Another calls a different function entirely. Each was the correct fix for the bug that prompted it. Together, they're unmaintainable.

**The agent isn't broken.** It's optimizing for *fix this bug* instead of *prevent this class of bugs*. It lacks a mental model for where guards belong.

That's problem one. I thought it was the whole story. I was wrong.

---

## Problem 1: The guards scatter

The fix is a rule file, not more code. Drop this in your project's agent instructions:

```markdown
## Guard Placement Rules

All validity checks follow the three-layer pattern:

1. **Entry**: `get_active_resources()` pre-filters collections
2. **Wrapper**: `@with_validity_guard` decorates business logic
3. **Source**: `fetch_resource()` checks before external calls

When adding a new validity check:
- Collection? add to entry filter
- Function? apply the decorator
- Fetch? already guarded at source

Do NOT add inline if-statements. Use the existing guards.
```

The three layers cover each other's blind spots:

| Layer | Catches | Misses |
|-------|---------|--------|
| **Entry** | Invalid items in collections | Direct references that bypass loader |
| **Wrapper** | Any decorated function | Undecorated new functions |
| **Source** | Last check before I/O | Data already in system |

All three call the same `is_valid()` function. One source of truth. One place to update when requirements change.

Without the rule, the agent adds another inline guard. With the rule, the agent applies the decorator. Same bug, same agent, different output. The mental model changes the fix.

---

## Problem 2: Some guards have opinions

I was auditing a trading platform when I found this:

```python
# Auto-detect exchange
if "BINANCE" in symbol.upper() or symbol.endswith("USDT"):
    exchange = "BINANCE"
elif any(x in symbol for x in ["CE", "PE", "FUT"]) or len(symbol) > 15:
    exchange = "NFO"
else:
    exchange = "NSE"
```

This guard isn't just scattered. It's *thinking*. It's making a cognitive decision — "what exchange does this symbol belong to?" — using substring matching and character counting.

And it's wrong.

RELIANCE is one of India's biggest stocks. An equity you trade on NSE. But its name ends in "CE" — which this code interprets as a Call option. So RELIANCE gets classified as an NFO derivative. Try selling it and the safety check blocks you:

```python
if any(x in symbol for x in ["CE", "PE"]) and side.upper() == "SELL":
    errors.append("NFO option selling BANNED (unlimited risk)")
```

The guard is protecting you from unlimited risk. Except RELIANCE isn't an option. The guard has an opinion, and the opinion is wrong.

This isn't a one-off. In the same codebase, I found a Telegram signal parser: 30 lines of regex trying to decide if a message means "buy" or "sell," which exchange it refers to, and what symbol is being discussed. It worked for English messages following a specific format. It missed "Long NIFTY." It missed Hindi. It missed every synonym for "buy" that wasn't literally "BUY."

These aren't structural checks. They're cognitive decisions wearing if-statement costumes.

---

## The factory floor

Think of your application as a factory. Conveyor belts move items between workstations. Workers at each station make decisions.

The temptation: add little sorting robots to the conveyor belts. "If it's red, it's ripe. Send it left." Cheaper than hiring a worker for every decision.

The problem: yellow tomatoes. Red peppers. Your sorting robot sends red peppers to the "ripe fruit" bin because it can only see color. Every edge case needs a new rule. The rules pile up, conflict, and eventually the factory grinds to a halt.

The fix: keep the belts dumb. Their job is to carry items, not judge them. Every time something needs a decision, hand it to a worker.

In code: the belt is your framework. The worker is an AI model. Your code should be a dumb, deterministic shell that gathers context, calls a model for decisions, validates the structure of the response, and executes mechanically.

Steve Yegge calls this Zero Framework Cognition, and it mirrors a long history of separating mechanism from policy. Martin Fowler's "smart endpoints, dumb pipes." Unix's kernel vs userspace. Karpathy's Software 2.0. The principle is old. The application to AI orchestration is new.

---

## The spectrum

Not every if-statement is a problem. Here's the line:

```python
# These are fine (structural/deterministic):
if not result.get("success"):       # Schema check
    raise APIError()

if quantity <= 0:                    # Math validation
    return "Quantity must be positive"

lot_size = instruments[symbol]["lot_size"]  # Deterministic lookup

# These are violations (cognitive/semantic):
if "CE" in symbol:                   # Guessing instrument type
    exchange = "NFO"

if len(symbol) > 15:                 # Arbitrary threshold as classifier
    exchange = "NFO"

if "BUY" in text.upper():           # Inferring intent from keywords
    action = "BUY"
```

**The rule:** if a human would need judgment to make the same decision, your if-statement can't do it reliably.

Schema checks, math, and lookups are plumbing. They stay as code. Intent classification, instrument detection, and error categorization are judgment calls. They go to a model.

---

## The fix: wrap and swap

You don't need to rewrite everything. The Strangler Pattern works:

```python
# Step 1: Find the semantic if-statement
if any(x in symbol for x in ["CE", "PE"]):
    exchange = "NFO"

# Step 2: Wrap it in a function (same behavior, new interface)
def detect_exchange(symbol):
    if any(x in symbol for x in ["CE", "PE"]):  # old guts
        return "NFO"
    return "NSE"

# Step 3: Swap the guts
async def detect_exchange(symbol):
    instrument = await instruments_lookup(symbol)  # new guts
    return instrument.exchange

# Callers never change.
```

For the RELIANCE bug, we replaced three copies of heuristic exchange detection with one function that looks up the instrument in an actual database. Deterministic. Correct. No opinions.

For cases where no lookup exists — where you genuinely need judgment — call a model. The Telegram signal parser becomes:

```python
async def parse_signal(text):
    parsed = await model_call(
        model="haiku",
        prompt=f"Extract: action, symbol, exchange. Message: {text}",
        schema=SignalSchema
    )
    return parsed
```

Haiku costs about $0.001 per call. It handles any language, any format, any synonym. Your 30 lines of regex couldn't.

---

## "But model calls are expensive"

They are. So use the right size.

Hard decisions go to the expensive model. Easy decisions go to the cheap one. Most decisions are easy.

```
Classify a complex multi-leg option strategy  -->  Opus
Detect exchange from symbol name              -->  Haiku
Parse a trading signal from text              -->  Haiku
Decide if a commit is a breaking change       -->  Sonnet
```

The pyramid exists today. Claude has Haiku, Sonnet, and Opus. GPT has Mini, 4o, and o1. You already have the knobs. The question is whether you're turning them, or sending everything to the medium tier because that's the default.

---

## The irony

I started writing this post and realized I needed a tool to detect semantic if-statements in codebases. My first instinct: build a linter. Write AST rules. Use semgrep.

Then I caught myself. A linter that uses pattern matching to detect when pattern matching is being used for semantic decisions is... exactly the problem I'm describing.

The answer is simpler. Grep for the suspicious patterns:

```
any(x in VAR for x in [...])
re.search() inside if/elif
len(VAR) > NUMBER as classifier
3+ elif chains with string comparisons
```

Read the context around each match. Ask a model: "Is this a structural check or a semantic decision?"

Dumb search. Smart classification. No linter needed.

---

## The three diseases

Your code has three diseases, and they all look like if-statements:

| Disease | Symptom | Fix |
|---------|---------|-----|
| **Scattered guards** | Same check in 4 files, 3 implementations | Three-layer pattern + rule file |
| **Semantic heuristics** | Regex/substring matching for cognitive decisions | Model call or deterministic lookup |
| **You can't tell them apart** | `endswith("CE")` looks structural but isn't | Grep + model classification |

The first one is structural. Give your agent a mental model for where guards go, and the scattering stops.

The second one is cognitive. Your code is making decisions it's not qualified to make. Replace them with something that is: a model, or a real data source.

The third one is the meta-problem. And it's proof that the fix for the second disease can't be more code. It has to be a model.

---

## The takeaway

If you're fixing the same class of bug repeatedly, you're not missing a guard. You're missing a mental model.

And if your guards are using regex to make semantic decisions, you're not missing a model. You're missing a model *call*.
