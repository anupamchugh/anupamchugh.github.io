---
draft: false
title: "Vouch for agents: trust scoring for non-human contributors"
date: '2026-02-09T21:00:00.000Z'
categories: [agents, open-source]
keywords: [vouch, agents, trust, multi-agent, coordination, mitchellh, beads]
slug: /vouch-for-agents
type: note
published: true
---

Mitchell Hashimoto's [Vouch](https://news.ycombinator.com/item?id=46930961) hit 752 points on HN. the core idea: explicit trust for open source contributors. you vouch for someone, they get in. you denounce them, they're out. simple, human, accountable.

now flip it to agents.

**the problem:** three parallel agents modify shared state. agent A refactors the auth module. agent B rewrites the tests. agent C touches both. who do you merge first? right now the answer is implicit — whoever writes last wins. there's no vouch signal. no denounce signal. no trust score. just timestamps.

**agent trust scoring:** agent A's changes pass tests, lint clean, no regressions — trust++. agent B breaks CI on merge — trust--. agent C's changes conflict with A — check trust scores, merge the higher-trust changeset first. this isn't hypothetical. anyone running multi-agent workflows has hit the "which agent do i believe" problem.

**score propagation:** agents spawned by high-trust orchestrators should inherit baseline trust. if your lead agent has a track record of clean merges, its sub-agents start with credibility. bad spawns drag the parent's score down. accountability flows upward.

**cross-pollination with issue tracking:** if you're using something like [beads](https://github.com/beads-project/beads-spec) for task tracking, tasks could carry trust scores from the agent that closed them. a task closed by a high-trust agent needs less human review. a task closed by a low-trust agent gets flagged automatically. the trust score becomes a triage signal.

**the open question:** has Hashimoto thought about Vouch for non-human contributors? the system already has the right primitives — vouch, denounce, identity, accountability. the gap is that agents don't have stable identities across sessions. an agent that does great work today is a fresh process tomorrow with no reputation.

stable agent identity + Vouch = a trust layer for multi-agent open source. someone should build this.
