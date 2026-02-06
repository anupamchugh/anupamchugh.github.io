---
title: "the future of agentic coding is bottlenecked by a tmux split-pane race condition"
date: '2026-02-06T18:00:00.000Z'
categories: [notes]
keywords: [claude-code, agent-teams, tmux, race-condition, agentic-coding]
slug: /tmux-split-pane-race-condition
type: note
---

agent teams in Claude Code have a terminal multiplexing problem. when you spawn teammates, the system splits your current tmux pane instead of creating a new window. this causes a race condition -- keystrokes intended for one agent land in another, and layout corruption compounds as more agents spawn.

**what happens:** you start a team with 3 agents. Claude Code calls `tmux split-pane` for each. your original pane shrinks. input focus races between panes. you type a response and half the characters go to agent-2's pane. the layout eventually becomes unusable and you're left force-killing tmux sessions.

**why it matters:** agent teams are the most interesting capability in Claude Code right now. the `TeamCreate` / `SendMessage` / `TaskList` coordination protocol works. agents can decompose problems, claim tasks, send messages, and merge results. but the tmux layer underneath is a single point of failure. every team session i've run has eventually hit layout corruption or keystroke interleaving.

**the fix seems clear:** spawn each teammate in a new tmux window (or a detached session), not a split of the current pane. splits share a single terminal's input buffer. windows don't.

filed as [github.com/anthropics/claude-code/issues/23615](https://github.com/anthropics/claude-code/issues/23615).

the irony: the agentic future isn't blocked on context windows, tool use, or planning ability. it's blocked on a 30-year-old terminal multiplexer's pane-splitting semantics.
