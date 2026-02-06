---
title: "active specs: why intent should rule code"
date: '2026-02-06T21:00:00.000Z'
categories: [notes]
keywords: [agents, specs, drift, harness-engineering, active-specs, context-entropy]
slug: /active-specs
type: note
---

we keep blaming agents for hallucinating. the real problem is context entropy -- the world drifts away from the prompt while the agent keeps building.

three levels of agent harness maturity:

**level 1: the static harness.** a markdown file that says "don't do X." prevents known mistakes. rots the moment your environment changes. the checklist that nobody updates.

**level 2: the immune system.** every agent failure produces a rule file. agent duplicates a utility function? write a rule: "grep utils before writing new helpers." agent ignores a broken build? write a rule: "fix blockers before features." each rule is an antibody against a specific failure class. reactive, but it compounds.

**level 3: active specs.** this is the missing piece. specs shouldn't be passive markdown that we hope the agent reads. they should be tracked entities that push. when a requirement changes, every linked task gets flagged automatically. the spec doesn't wait to be consulted -- it screams when reality diverges from intent.

six kinds of drift kill agent workflows:

- **spec drift** -- requirements change, tasks don't know
- **skill drift** -- same instruction works in one environment, breaks in another
- **visibility drift** -- you can't see what's actually running
- **stability drift** -- upstream churn invalidates work in flight
- **behavioral drift** -- the agent wobbles away from instructions over time
- **comment drift** -- docs say one thing, code does another

every one of these inflates the cost of supervising agents. and supervision cost is what kills adoption. not capability -- cost of checking the work.

the framing matters: "code as spec" is backwards. code is implementation. the spec -- the intent -- should rule. active specs mean the intent has teeth. it doesn't just describe what should happen; it enforces coherence between what was planned and what got built.

we don't need more generative tooling. we need homeostatic tooling that maintains alignment between intent and execution. less "write code for me," more "tell me when reality drifts from the plan."
