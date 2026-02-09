---
draft: false
title: "Stop generating, start composing"
date: '2026-02-09T20:00:00.000Z'
categories: [agents, workflow]
keywords: [ai-coding, skills, prose-first, composability, claude-code, mcp]
slug: /stop-generating-start-composing
type: note
published: true
---

["Stop generating, start thinking"](https://localghost.dev/blog/stop-generating-start-thinking/) is on [HN today](https://news.ycombinator.com/item?id=46938958) (97 points). The argument: AI coding is a trap because you can't maintain code you didn't write.

I agree with the diagnosis. Disagree with the prescription.

The problem isn't generation. It's *unstructured* generation — prompting an LLM ad-hoc and hoping the output holds up. That fails. Obviously.

The alternative isn't to stop generating. It's to stop generating *from scratch every time*.

200 skills later, here's what actually works: prose-first composition. Skills are prose instructions, not code. They describe intent, constraints, and the default action. The LLM *executes* a skill — it doesn't improvise from a vague prompt.

[acjohnson55 on HN](https://news.ycombinator.com/item?id=46938958) gets it: "I have turned the corner where I barely hand-edit anything. Most of the tasks I take on are nearly one-shot successful, simply pointing Claude Code at a ticket URL."

How? Not by writing better prompts. By building a *system*:

- **Skills** = composable runbooks (description-matched, not slash-invoked)
- **MCP servers** = typed tool interfaces (10 servers, each a "device driver" for a different system)
- **Drift detection** = wobble scores that catch when a skill's behavior drifts from its intent
- **Memory layer** = lessons extracted with confidence scores, curated back into the next session

The thinking happened when you wrote the skill. The generation happens when you invoke it. That's composition, not improvisation.

[rubyfan's objection](https://news.ycombinator.com/item?id=46938958) — "I could do it perfectly well in less time than it takes to hone the prompt" — is correct *if* the prompt is single-use. It's wrong if the prompt becomes a reusable skill that fires correctly 200 times.

Don't stop generating. Start composing.
