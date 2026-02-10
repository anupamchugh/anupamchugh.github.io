---
draft: false
title: "Inbound vs outbound: the two kinds of agents you need for open source"
date: '2026-02-09T15:00:00.000Z'
categories: [agents]
keywords: [agents, open-source, inbound, outbound, automation, intelligence]
slug: /inbound-vs-outbound-agents-for-open-source
type: note
published: true
---

Most agent systems are inbound. They watch other people's work and extract value for you. "Analyze this repo." "What patterns does this developer use?" "Summarize this blog." The arrow points from them to you.

I built three of these: one reads blogs, one reads repos, one reads a developer's entire GitHub profile. They work. They taught me how Jesse Vincent designs MCP tools, how Mitchell Hashimoto thinks about trust, how Steve Yegge structures issue trackers. Useful, but one-directional.

The missing half is outbound. Instead of "what can I learn from them?" the question becomes "where can what I've built help someone else?"

**The difference matters because they require different architectures.**

An inbound agent is mostly extraction. Fetch content, classify it, summarize. The hard part is filtering noise. You can get away with a skill that calls a few APIs and asks a model to categorize the results.

An outbound agent is mostly matching. It needs to know your patterns, scan their problems, and judge whether your solution fits at the right scale. Four of seven steps are cognitive decisions: filtering candidates, matching patterns, scoring relevance, ranking by effort. A prose skill would reduce these to keyword matching. The model has to do the thinking.

**How they work together:**

```
INBOUND (learn from others):
  blog-analyzer   → extract insights from their blog
  repo-analyzer   → deep-dive one repo for patterns
  creator-analyzer → scan all repos from a user

OUTBOUND (help others):
  outbound-scout  → match YOUR patterns to THEIR problems
```

The inbound agents build your knowledge base. The outbound agent deploys it. The inbound side taught me that concurrent git pushes fail silently in flat-file systems. The outbound side noticed that vouch had exactly that bug, with a `help wanted` tag, and my issue tracker already had the fix.

**The filter is the hard part.** Scanning Hacker News gives you 30 projects. Most are irrelevant. The outbound agent runs a survival scorecard on each match: will this matter to the maintainer in a year? Does the fix match at their scale? Is the effort proportional? Two out of four ideas survived for vouch. The two that died would have wasted everyone's time.

The best open source contributions aren't cold PRs from strangers. They're pattern transfers where the contributor already solved the same structural problem in a different domain. Inbound agents help you see patterns. Outbound agents help you place them.

---

*Built with Claude Code agents. The outbound scout costs about $0.12 per scan.*
