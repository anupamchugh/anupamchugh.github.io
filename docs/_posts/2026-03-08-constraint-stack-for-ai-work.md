---
title: "Constraint Stack for AI Work: A Practical Template"
description: A five-part template for making AI output measurable, verifiable, and safe
date: '2026-03-08T16:30:00.000Z'
categories: [ai, engineering]
keywords: [constraints, ai coding, verification, acceptance criteria, task verifier]
slug: /constraint-stack-for-ai-work
---

If constraints are the moat, we need a repeatable way to define them.

Here is the template I now use before handing work to an AI system.

## The Constraint Stack

1. **Goal**  
   What exactly should be true when this is done?
2. **Acceptance criteria**  
   Measurable pass/fail rules.
3. **Task verifier**  
   How we independently check the output is actually correct.
4. **Failure boundary**  
   What the agent is not allowed to touch.
5. **Rollback and audit**  
   How we recover and what evidence we keep.

## Worked Example: SQLite Rewrite Prompt

A vague prompt: "rewrite this SQLite layer in Rust."

A constrained prompt:

- **Goal:** Rust implementation of the same query behavior.
- **Acceptance criteria:**
  - p99 read latency <= 50ms on benchmark workload
  - handles 10k queries/second on local benchmark harness
  - uses indexed lookup path for primary-key reads
  - zero data-loss regression tests pass
- **Task verifier:**
  - run benchmark harness and compare against baseline
  - run query planner inspection for PK lookups
  - run integration and regression test suite
- **Failure boundary:**
  - do not modify schema migration files
  - do not change wire protocol
- **Rollback and audit:**
  - feature flag for old path
  - benchmark report attached to PR
  - reproducible test command in CI logs

Same model. Different result quality.

## Why This Helps

Most AI failures are not model-too-dumb failures. They are objective-too-vague failures.

The constraint stack does two things:

- gives the model a target it can optimize for
- gives humans a way to reject plausible-but-wrong output quickly

That is the difference between moving fast and moving randomly.
