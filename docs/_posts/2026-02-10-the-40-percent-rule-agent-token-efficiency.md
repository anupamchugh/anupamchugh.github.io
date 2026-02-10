---
draft: false
published: true
title: "The 40% Rule: What Running 4 Agents in Parallel Taught Me About Token Efficiency"
date: '2026-02-10T10:00:00.000Z'
categories: [engineering]
keywords: [agents, token-efficiency, multi-agent, orchestration]
slug: /the-40-percent-rule-agent-token-efficiency
type: note
---

I ran 4 parallel agents for the first time last week. Total cost: 217K tokens. After analyzing the execution traces, I found 40% was waste.

**The Breakdown**

Best performer: 32K tokens, 6 tool calls, 53 seconds. Task was narrow and well-defined.

Worst performer: 84K tokens, 17 tool calls, 225 seconds. Broad task, 5 failed external calls, had to restart infrastructure mid-execution.

**Three Anti-Patterns**

1. **Infrastructure race conditions** — Two agents independently restarted the same shared service within seconds of each other. Both spent tokens checking status, both attempted restart, one failed.

2. **Scan duplication** — Two agents querying the same data source independently. Each paid the full API cost for identical data.

3. **Role confusion** — Agents doing infrastructure work (authentication, service health checks) instead of analysis. The wrong layer was making those calls.

**The Fix: Scan Once, Share Results**

The orchestrator now fetches data once and injects results into agent prompts. Agents receive pre-loaded context and do analysis only.

Estimated optimal: ~130K tokens for the same 4-agent run.

**Best Agent Template**

Three-step prompt structure:
1. Check (verify data exists)
2. Generate (run analysis)
3. Report (structured output)

Zero improvisation. Exact tool selection predefined. No retry logic inside agents — that's the orchestrator's job.

The 40% rule isn't about cutting costs. It's about making each token count.
