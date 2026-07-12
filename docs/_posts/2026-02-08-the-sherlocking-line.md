---
draft: false
title: "The Sherlocking Line"
date: '2026-02-08T23:30:00.000Z'
categories: [notes]
keywords: [agent-teams, claude-code, sherlocking, cross-runtime, mcp-agent-mail]
slug: /the-sherlocking-line
type: note
published: true
---

Claude Code shipped agent teams this week. Built-in mailbox, task list, file locking — zero config. I had a fork of agent-mail with heartbeat tracking and a PR upstream when it dropped.

Inside a single session, the built-in version wins on friction alone. It always will. That's the sherlocking pattern: whatever the runtime can absorb, it will absorb.

But agent teams is session-scoped. It dies when you close the terminal.

I run Claude Code during the day, hand off to Codex overnight, pick up in the morning. Different runtimes, async, persistent. No cross-tool messaging. No file leases that outlive the session. No audit trail.

The sherlocking line is the runtime boundary. Everything inside the walls gets absorbed. Everything that crosses runtimes — Claude Code to Codex to Cursor to whatever ships next quarter — that's where community tooling still has room.

Until that gets absorbed too.

**Previously:** [claude code agent teams — what changes for multi-agent coordination](/claude-code-agent-teams-what-changes)

**HN Discussion:** [My threads on agent coordination](https://news.ycombinator.com/threads?id=anupamchugh)
