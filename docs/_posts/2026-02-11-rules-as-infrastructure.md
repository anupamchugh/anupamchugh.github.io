---
title: "I Wrote 40 Rules for My AI. They Cost More Than My Bugs."
date: '2026-02-11T20:29:00.000Z'
categories: [notes]
keywords: [ai-engineering, rules-files, observability, structural-waste, infrastructure, claude-code]
slug: /rules-as-infrastructure
type: note
---

# I Wrote 40 Rules for My AI. They Cost More Than My Bugs.

Source: Dogfooding Session Sage on 27 Claude Code sessions (Feb 11, 2026)

## Titles

- **Blog title**: "I Wrote 40 Rules for My AI. They Cost More Than My Bugs."
- **HN submission title**: "Rules Files Are the New node_modules"

Scored by Yegge (viral potential) and Hashimoto (technical credibility):

| Title | Yegge | Hashimoto | Notes |
|-------|-------|-----------|-------|
| I Wrote 40 Rules... Cost More Than My Bugs | 9/10 | 7/10 | Personal, specific number, surprising claim |
| Rules Files Are the New node_modules | 10/10 | 6/10 | Perfect HN bait — everyone hates node_modules |
| Silent Success: Why Your Hooks Cost More Than Bugs | 7/10 | 9/10 | Most technically precise, less viral |
| The Invisible 30%: Structural Waste in Automated Systems | 5/10 | 8/10 | Enterprise-y, low click rate |
| You Instrument Your Servers. Why Not Your AI Sessions? | 8/10 | 7/10 | Good question format, but "AI sessions" narrows audience |

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

**CI parallel**: Your CI pipeline runs `npm install` before every job. Even the one that just checks a typo in a README. The install step takes 90 seconds whether the test takes 2 seconds or 20 minutes. That's boot tax. The AI version is identical — rules load whether the session needs them or not.

### 2. Validation Tax
Hooks/checks that fire on every operation. 6 hooks x every bash command = 1,811 invocations/day. Each injects "system-reminder" text into context even when the check passes. The principle: success should be invisible. Only failure should generate signal.

**CI parallel**: Scroll past 500 green checkmarks in your CI output. Each "OK" line was logged, transmitted, rendered, and ignored. Multiply by every PR, every day. Green output is structural waste — it exists for debugging failures that haven't happened.

### 3. Re-read Tax
Rules and reference files loaded repeatedly across sessions with no caching layer. A 600-line routing skill read 28 times in one day, never edited. An 8,000-line UI file read 96 times, edited 15 times.

**CI parallel**: Your CI re-downloads the same Docker base image for every build. The image hasn't changed in 3 months. Layer caching exists but you haven't set it up. Same pattern — repeated reads of unchanged content because the system doesn't track freshness.

## The Data

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

Don't need to anonymize this — it's my own project, my own sessions. The specific numbers matter because they're real, not theoretical.

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

The "???" column is the blog post. The pattern is general.

## Principles to Extract (framework-agnostic)

### Silent Success
Every validation checkpoint has two outputs: pass or fail. The fail path gets all engineering attention. The pass path is assumed free. It isn't. Every "OK" output costs: log storage (servers), network bandwidth (distributed), context tokens (AI), human attention (dashboards). Success should be invisible.

### The Boot Tax Curve
Fixed cost per operation means short operations are proportionally more expensive. When boot cost exceeds task cost, you have a boot tax problem. Solutions: tiered loading (load only what's relevant), caching (remember what was loaded last time), consolidation (reduce the count).

### Rules Decay Like Code
Rules written for a codebase that changed 6 months ago are worse than no rules — they give false confidence. Rules need the same lifecycle as code: write, test, measure, deprecate, delete.

### Rules Contradict Silently
Two ESLint rules that contradict each other throw an error. Two prose rules that contradict each other both get followed — partially, incorrectly, or alternately. You get inconsistent behavior with no stack trace. This is worse than no rules at all, because you can't debug "sometimes the AI does X and sometimes Y" without reading all 40 rule files and spotting the contradiction manually.

### The New Hire Handbook Problem
Each session starts by loading all context — every rule, every hook, every reference file. It's like handing a new hire a 200-page company handbook on day one and saying "read all of this before you touch anything." A new hire skims or ignores most of it. AI sessions can't skim — they process every token. But they also can't prioritize — a rule about JSON serialization gets the same weight as a rule about not losing money. The handbook gets thicker every week. Nobody removes pages. The new hire orientation takes longer every month.

### Measure the Ratio
For any repeated automated operation: measure the work-to-overhead ratio. If overhead exceeds 20%, you have structural waste. The tools to measure this don't exist yet for most systems. Build them.

## Counterarguments to Address

### "Just use fewer rules"
Yes, but you also "just" use fewer npm packages. The incentive structure works against you — each rule is individually reasonable, each package solves a real problem. The waste is emergent, not intentional. You need measurement to see it.

### "This is an AI-specific problem"
It isn't. CI pipelines, Docker builds, Kubernetes configs, ESLint rulesets, Terraform modules — all have the same boot tax, staleness, and contradiction problems. The AI case just makes the cost visible because tokens have a dollar price.

### "Rules are cheap compared to model inference"
Rules are cheap per-token. But they compound: 40 rules x 27 sessions x 365 days = overhead that dwarfs any single inference call. The same argument was made about logging ("disk is cheap") until someone measured their Datadog bill.

### "My rules are all necessary"
Audit them. We found rules about features deleted months ago, rules that contradicted each other, and rules that the AI couldn't follow anyway (too vague). Of our 40 rules, roughly 8 were actively useful. The rest were legacy, aspirational, or redundant.

## Try This Yourself

Two commands to find your own waste:

```bash
# Count your rules (Claude Code / Cursor / Windsurf)
find . -name "*.md" -path "*rules*" -o -name ".cursorrules" | wc -l

# Estimate boot tax (rough: ~250 tokens per rule file)
find . -name "*.md" -path "*rules*" -exec wc -w {} + | tail -1
# Divide total words by 0.75 for approximate tokens
```

If you have more than 15 rule files, you probably have contradictions. If more than 25, you almost certainly have rules about code that no longer exists.

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

## Suggested Post Structure

1. **Hook**: "I wrote 40 rules for my AI coding assistant. They cost more than my bugs."
2. **The measurement**: What we found, with numbers (the data table)
3. **The three taxes**: Boot, validation, re-read — with CI parallels for each
4. **The dependency analogy**: The comparison table (rules = new node_modules)
5. **The principles**: Silent success, boot tax curve, rules decay, contradictions, new hire handbook
6. **Try this yourself**: The 2-command grep script readers can run right now
7. **Counterarguments**: Address the 4 obvious objections
8. **The "???" column**: What's missing and what to build

## Yegge Survival Review

**VERDICT: SURVIVES (4 High, 2 Medium)**

| Lever | Score | Reason |
|-------|-------|--------|
| Insight Compression | HIGH | "30% structural waste" with data — can't re-derive this from first principles |
| Substrate Efficiency | HIGH | Text analysis, no model calls needed to reproduce |
| Broad Utility | HIGH | Anyone with .cursorrules, CLAUDE.md, or similar has this problem |
| Publicity/Awareness | MED | node_modules analogy will land on HN, but needs the CI angle to go broader |
| Friction | MED | "Try this yourself" section needed — readers must be able to reproduce |
| Human Coefficient | HIGH | Rules are written BY humans FOR automated systems — irreducibly human |

**What Yegge would cut**: Any mention of specific tools you built. The post is about the problem, not the solution. One line at most: "we built tools to measure this." Link to repo. Done.

**What Yegge would add**: The non-AI example FIRST. Open with CI boot tax or ESLint bloat, then pivot to "and here's where it costs actual money." Broader entry point = broader audience.

## Hashimoto Review

**What Hashimoto approves**: Real data, specific numbers, reproducible methodology.

**What Hashimoto would demand**:
1. **"Try this yourself" section** — the 2-line grep command. Readers must be able to check their own waste in 30 seconds.
2. **Show the methodology** — how did you measure? Not just "we analyzed transcripts" but "we parsed JSONL session logs for tool_use events and counted tokens by category."
3. **Reproduce twice** — did you run the analysis twice on different days? If 27 sessions on day 1 showed 30% waste, what did day 2 show? Reproducibility is credibility.
4. **One mention of your tool, max** — the post is about the discovery, not the product. If readers smell a product launch, they'll dismiss the data.

## Prior Art to Reference

- Mitchell Hashimoto on "reproduce work twice" for verification
- CASS (Dicklesworthstone) as session search — the observability layer
- Datadog/Langfuse as production LLM monitoring — the gap we fill
- Lambda cold starts / Docker image pulls — the boot tax analogy
- npm dependency bloat — the rules bloat analogy
- "Ask HN: What do you put in claude.md?" — the starting point

---
Date: 2026-02-11
Status: Notes captured, HN researched, reviews done, ready for expansion
Next: Expand to full post using suggested structure, @blog refine, publish
