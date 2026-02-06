---
title: "your agent isn't hallucinating. your specs are dead."
date: '2026-02-06T21:00:00.000Z'
categories: [notes]
keywords: [agents, specs, drift, harness-engineering, active-specs, context-entropy]
slug: /active-specs
type: note
---

we keep blaming agents for hallucinating. the real problem is context entropy -- the world drifts away from the prompt while the agent keeps building.

mitchell hashimoto's [harness engineering](https://mitchellh.com/writing/my-ai-adoption-journey) is the right instinct: every time an agent fails, engineer a fix so it never fails that way again. i've been implementing this as discrete rule files -- one per failure class. agent duplicates a util? rule: "grep existing helpers first." agent builds while the build is broken? rule: "fix blockers before features." after a few months you have 30+ of these. each one is an antibody. the harness becomes an immune system that compounds.

but there's a level beyond reactive rules: specs that push.

specs shouldn't be passive markdown we hope the agent reads. they should be tracked entities. when a requirement changes, every linked task gets flagged automatically. the spec doesn't wait to be consulted -- it screams when reality diverges from intent.

this isn't just CI or contract testing. contract tests verify the code matches a schema. active specs verify the *work* matches the *intent* -- flagging in-progress tasks, not just failing builds. the difference: contract tests catch bugs in code. active specs catch drift in planning.

"but specs rot too." yes -- that's the point. a static spec rots silently. an active spec rots loudly. when the spec changes, everything downstream knows. that's the difference between a dead document and a living one.

three kinds of drift matter most:

- **spec drift** -- requirements change, tasks don't know. the agent builds the wrong thing perfectly.
- **skill drift** -- same instruction works in one environment, breaks in another. you debug environments instead of shipping.
- **behavioral drift** -- the agent wobbles away from instructions over time. you supervise instead of delegating.

every one of these inflates the cost of supervising agents. and supervision cost is what kills adoption. not capability -- cost of checking the work.

the [spec-driven development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) crowd is already saying "merge specs, not code." they're right about the direction — specs as the primary artifact, code as derived output. but they're still treating specs as passive input to generation. the missing piece: specs that monitor their own implementation and flag when reality drifts.

everyone keeps saying "code is the spec." no. code is the corpse of the spec. the spec is the intent — and if it can't enforce itself, it's just prose rotting in a docs folder.

we don't need more generative tooling. we need homeostatic tooling that maintains alignment between intent and execution. less "write code for me," more "tell me when reality drifts from the plan."
