---
draft: false
title: "The hard part isn't harder — it's visible now"
date: '2026-02-09T19:00:00.000Z'
categories: [agents, ai]
keywords: [ai-coding, architectural-debt, agents, composability, foundations, mcp]
slug: /the-hard-part-isnt-harder-its-visible
type: note
published: true
---

Blundergoat's ["AI makes the easy part easier and the hard part harder"](https://www.blundergoat.com/articles/ai-makes-the-easy-part-easier-and-the-hard-part-harder) is [trending on HN](https://news.ycombinator.com/item?id=46939593) (234 points). The thesis: AI handles boilerplate but makes architecture, debugging, and integration *harder*.

I don't think the hard part got harder. I think it got *visible*.

Before agents, you could hide architectural debt behind manual heroics. A senior dev holds the system in their head, patches around the rot, ships on time. The debt stays invisible because it's distributed across human memory.

Now agents expose it. An agent can't hold tribal knowledge. It reads your manifest, your specs, your config. If the foundations are typed and composable, agents chain through them cleanly — MCP server calls backend API calls business logic, each stage returning compact structured output. If the foundations are messy, agents amplify the mess at machine speed.

[socketcluster on HN](https://news.ycombinator.com/item?id=46939593) nailed it: "If your codebase has bad foundation... it will just write code which mirrors the existing style." Agent output mirrors the quality of your architecture.

The fix isn't "use less AI." It's:

1. **A manifest** — WORKSPACE.yaml or equivalent. Single source of truth that any agent can read on landing.
2. **Typed boundaries** — specs with lifecycle tracking (new → active → archived), content hashes for drift detection.
3. **Composable tools** — few flexible MCP tools over many specific ones. `wallet(exchange="all")` beats separate `wallet_exchange_a()` + `wallet_exchange_b()`.
4. **Self-healing** — drift detection that catches when skills or specs go stale before they break a workflow.

The divide isn't "easy vs hard." It's workspaces with infrastructure vs workspaces held together by tribal memory. Agents just made the difference undeniable.
