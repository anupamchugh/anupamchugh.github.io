# Rules as Infrastructure: The Hidden Cost of Teaching AI How to Code

Source: Dogfooding Session Sage on 27 Claude Code sessions (Feb 11, 2026)

## The Gap on HN

Nobody has written this. Searched extensively:
- "Ask HN: What do you put in claude.md?" — discusses organization, ZERO cost discussion
- "How I use every Claude Code feature" — mentions compaction pain, no measurement
- LLM observability tools (Datadog, Langfuse, Braintrust) — all production API monitoring, not developer session waste
- "Rules file backdoor" security posts — treat rules as attack surface, not as infrastructure to manage
- "Context window poisoning" — security angle, not engineering angle

**The hole: Everyone talks about what to PUT in rules. Nobody measures what rules COST.**

## Core Thesis

A new category of engineering infrastructure has emerged: prose instructions that modify automated system behavior. These instructions need the same discipline as code — versioning, testing, measurement, refactoring — but nobody treats them that way yet.

## The Three Costs Nobody Measures

### 1. Boot Tax
Every AI coding session loads all rules at start. 40 rule files = 13K tokens before any work happens. 27 sessions/day = 351K tokens just booting. Same economics as Lambda cold starts or Docker image pulls — fixed cost per invocation, proportionally brutal for short operations.

### 2. Validation Tax
Hooks/checks that fire on every operation. 6 hooks x every bash command = 1,811 invocations/day. Each injects "system-reminder" text into context even when the check passes. The principle: success should be invisible. Only failure should generate signal.

### 3. Re-read Tax
Rules and reference files loaded repeatedly across sessions with no caching layer. A 600-line routing skill read 28 times in one day, never edited. An 8,000-line UI file read 96 times, edited 15 times.

## The Data (anonymized for the post)

```
27 automated coding sessions in one day
60MB of transcripts
~3-5 million tokens consumed
~1.6 million tokens (30-40%) wasted on structural patterns:

  Monolith re-reads:     473K (29.6%)
  Validation errors:     400K (25.0%)
  Hook overhead:         362K (22.6%)
  Boot tax:              351K (21.9%)
  Reference re-reads:     13K (0.8%)
  Exploration waste:      16K (1.0%)
```

## Key Insight: Rules Are the New Dependencies

| Aspect | Code Dependencies | Prose Rules |
|--------|-------------------|-------------|
| Load cost | Import time, binary size | Context tokens, boot tax |
| Bloat pattern | 2000 npm packages | 40 rule files nobody audits |
| Conflict risk | Version conflicts | Contradicting rules |
| Staleness | Unused deps | Rules about deleted features |
| Testing | Unit tests, CI | ??? (nobody tests prose rules) |
| Consolidation | Tree shaking | ??? (nobody trims prose rules) |
| Measurement | Bundle analyzers | ??? (nobody measures rule cost) |

The "???" column is the blog post. We built tools to fill those gaps. The pattern is general.

## Principles to Extract (framework-agnostic)

### Silent Success
Every validation checkpoint has two outputs: pass or fail. The fail path gets all engineering attention. The pass path is assumed free. It isn't. Every "OK" output costs: log storage (servers), network bandwidth (distributed), context tokens (AI), human attention (dashboards). Success should be invisible.

### The Boot Tax Curve
Fixed cost per operation means short operations are proportionally more expensive. When boot cost exceeds task cost, you have a boot tax problem. Solutions: tiered loading (load only what's relevant), caching (remember what was loaded last time), consolidation (reduce the count).

### Rules Decay Like Code
Rules written for a codebase that changed 6 months ago are worse than no rules — they give false confidence. Rules need the same lifecycle as code: write, test, measure, deprecate, delete.

### Measure the Ratio
For any repeated automated operation: measure the work-to-overhead ratio. If overhead exceeds 20%, you have structural waste. The tools to measure this don't exist yet for most systems. Build them.

### Line Passing
Each session starts by loading all context into the runner (model/agent/pipeline). It's a relay race where the baton is an instruction set. The baton gets heavier every time you add a rule, and nobody notices until the runner is too slow. This is the rules equivalent of dependency bloat.

## Angles for Expansion

1. **The observability gap**: Production LLM monitoring tools measure API calls. Developer session tools measure... nothing. You instrument your servers but not your coding sessions.

2. **The rule lifecycle**: How to test a prose rule. You can't unit test it, but you can reproduce the scenario and check compliance. "Reproduce twice" as a verification pattern.

3. **Tiered loading as architecture**: Not all rules matter for all tasks. A trading session doesn't need frontend rules. A UI session doesn't need safety-critical-TDD rules. Tiered loading is the equivalent of lazy imports or code splitting.

4. **The consolidation trap**: Merging 40 small files into 15 larger files feels productive but creates a Merge Wall problem — you spend more tokens reorganizing than you save. Better: make each file shorter.

5. **Prose as engineering artifact**: Version-controlled prose that modifies automated behavior IS code. It just doesn't have a type system, a linter, or a test runner. Yet.

## HN Framing

Don't frame as "AI token optimization" (too niche). Frame as:

**"Your CI pipeline has the same problem — you just haven't measured it."**

Everyone who's waited 20 minutes for CI knows boot tax. Everyone who's scrolled past 500 lines of green checkmarks knows silent success noise. Everyone who's inherited a project with 200 ESLint rules knows rules bloat.

The AI coding assistant case is just the most visible instance because the cost is measured in dollars-per-token, not seconds-per-build. But the engineering principles are the same.

## Title Candidates

1. "Rules as Infrastructure: The Hidden Cost of Teaching AI How to Code"
2. "The Invisible 30%: Structural Waste in Automated Systems"
3. "Silent Success: Why Your Validation Hooks Cost More Than Your Bugs"
4. "Boot Tax, Rule Bloat, and the New Dependency Problem"
5. "You Instrument Your Servers. Why Don't You Instrument Your AI Sessions?"

Recommendation: #1 for the full post, #5 as the HN submission title (question format performs well on HN).

## Prior Art to Reference

- Mitchell Hashimoto on "reproduce work twice" for verification
- CASS (Dicklesworthstone) as session search — the observability layer
- Datadog/Langfuse as production LLM monitoring — the gap we fill
- Lambda cold starts / Docker image pulls — the boot tax analogy
- npm dependency bloat — the rules bloat analogy
- "Ask HN: What do you put in claude.md?" — the starting point

---
Date: 2026-02-11
Status: Notes captured, HN researched, no prior art found
Next: Expand to full post, review with @blog refine, publish
