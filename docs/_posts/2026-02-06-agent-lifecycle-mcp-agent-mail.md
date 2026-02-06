---
draft: true
title: "agent lifecycle for MCP Agent Mail"
date: '2026-02-06T12:00:00.000Z'
categories: [notes]
keywords: [mcp-agent-mail, open-source, agent-lifecycle, heartbeat, fastmcp]
slug: /agent-lifecycle-mcp-agent-mail
type: note
published: false
---

submitted [PR #77](https://github.com/Dicklesworthstone/mcp_agent_mail/pull/77) to MCP Agent Mail — the "gmail for coding agents" project. added agent heartbeat presence, soft lifecycle management (mark dead / revive), soft-block messaging to dead agents, local timezone support on agent resources, and CLI commands for all of it.

maintainer reviewed it positively — called the heartbeat/presence concept "thoughtful" and said it "aligns well with the project's multi-agent coordination goals." project policy is no outside PRs, so he closed it but said he'd evaluate implementing some features independently.

the code lives on in [my fork](https://github.com/anupamchugh/mcp_agent_mail). i use it in production for multi-agent coordination. 7 commits, 12 files, fully tested.

**what i added:**
- heartbeat presence detection (alive / stale / offline / unknown)
- `mark_agent_dead` and `revive_agent` MCP tools
- soft-block messages to dead agents (with `allow_dead_recipients` override)
- `?tz=Asia/Kolkata` on agent resources for local timestamps
- CLI: `am agents list/dead/revive`
- UI: presence badges + action buttons + browser timezone auto-detect
