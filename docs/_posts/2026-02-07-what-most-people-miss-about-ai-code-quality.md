---
title: "what most people miss about ai code quality"
date: '2026-02-07T20:00:00.000Z'
categories: [agents, ai, code-quality]
keywords: [ai-coding, drift, specs, static-analysis, forcing-function, waterfall, code-quality]
slug: /what-most-people-miss-about-ai-code-quality
published: true
---

a [thread on HN](https://news.ycombinator.com/item?id=46916586) about writing quality code with AI hit 200 points today. 145 comments. i read all of them. the article has 12 reasonable principles. the comments fall into predictable camps. almost everyone is missing the actual problem.

here's what i noticed.

---

## "ai removes the thinking"

the most upvoted concern: writing code is a forcing function for thought. hand the coding to an agent and you lose the intellectual rigor. the details never get ironed out.

the forcing function didn't disappear. you just stopped looking for it.

code forces you to think because the compiler rejects nonsense. a spec forces you to think because the agent builds *exactly* what you wrote — including the parts you were vague about. vague code fails at compile time. vague specs fail at runtime, three sessions later, when nobody remembers why.

the danger was never "ai writes code for me." it's "i never learned to write specs because i could always just muddle through in code."

i run ~680 specs on a production codebase. writing them forces the same rigor as writing implementations. sometimes more — because you can't hide ambiguity behind a working-but-wrong function.

---

## "static analysis solves everything"

someone posted a beautiful hierarchy: typescript compiler, then linting, then complexity checks, then security scanning. if AI-generated code passes all four layers, it's good. right?

lint catches what the agent wrote wrong today. nobody's catching what it'll quietly rewrite next week.

the code that drifts worst on my codebase? the stuff that passes every static check. green CI, clean lint, zero warnings — and the retry logic now does something subtly different than what was specced 12 sessions ago because the agent didn't have that context.

static analysis is a seatbelt. drift detection is knowing you're on the wrong road. different problems.

---

## "this is just waterfall with ai buzzwords"

waterfall is the 1970s idea that software flows one direction: requirements, then design, then implementation, then testing, then deployment. no going back upstream. you write a 200-page spec, get sign-off, build for 6 months, then discover the spec was wrong. restarting means restarting the waterfall from the top.

agile killed it by saying: skip the 200-page doc, ship in 2-week sprints, learn as you go.

so when someone sees "write specs, document decisions, mark review levels" in an AI coding article, they say: you just reinvented waterfall and lost all the speed.

no. a 15-line spec that your agent reads on startup isn't waterfall. a lint rule in a pre-commit hook isn't waterfall. a rules file that fires automatically isn't waterfall. waterfall is humans enforcing process on humans. this is machines enforcing constraints on machines.

the speed you're protecting lasts about 3 weeks before the codebase turns into a contradictory mess no agent can reason about. then you're slow AND broken.

---

## "these are just basic best practices, nothing new"

exactly right. and that's the interesting part everyone walks past.

humans could ignore best practices and ship anyway — sloppy but functional. agents can't. an agent without a spec builds the wrong thing with absolute confidence. an agent without lint rules generates a different style per file. an agent without risk markers refactors your auth code as casually as renaming a CSS class.

ai didn't invent best practices. it made them load-bearing. the stuff that was "nice to have" for humans is "system crashes without it" for agents. that's the actual news here.

---

## "just review everything the ai writes"

one commenter described their workflow: use ai for scaffolding, review the output, correct it, scaffold more. "no different than stack overflow."

"a stack overflow that reads your codebase" — that's actually a perfect description. but stack overflow is stateless. agent sessions aren't.

session 5's scaffold assumes one pattern. session 8's scaffold contradicts it. you reviewed both in isolation. both looked fine. neither knows about the other.

reviewing AI code per-session is like proofreading individual chapters of a novel nobody's reading front to back. each chapter is fine. the plot makes no sense.

---

## "ai tests cheat"

someone pointed out that AI-written tests "sometimes don't even assert the code." they mock, stub, and hardcode values. the article suggests separating spec tests from implementation tests. that's half the answer.

the other half: tests outlive the specs they were written against.

agent writes correct test for spec v1. spec evolves to v2. later agent updates the implementation but not the test. test passes — because v1 behavior is a subset of v2. green CI. silent coverage erosion. nobody notices until prod breaks.

everyone's debating "do AI tests assert correctly." the real question: does anyone track whether the test still matches the spec it claims to verify?

---

## the pattern

every comment in that thread is solving for a point-in-time problem. is *this* generation correct? does *this* code pass *these* checks? does *this* test assert *this* behavior?

the actual problem is temporal. code that's correct today drifts tomorrow. tests that pass today cover less next week. specs that were clear last month have been silently reinterpreted by an agent that never read the original.

the thread has 145 comments about catching bugs. zero comments about catching drift.

that's what most people miss.
