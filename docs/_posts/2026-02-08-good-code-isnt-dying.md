---
title: "good code isn't dying"
date: '2026-02-08T14:00:00.000Z'
categories: [agents, ai, code-quality]
keywords: [ai-coding, code-quality, agents, silent-failure]
slug: /good-code-isnt-dying
published: true
---

amit prasad wrote about [the silent death of good code](https://amit.prasad.me/blog/rip-good-code). his thesis: agents make you productive, but output is "acceptable, not excellent." craftsmanship is dying.

i don't think it's dying. i think the audience changed.

i audited an agent-built codebase recently. 55 modules down to 8. the code passed lint, tests, review. the problem was code that *did nothing*.

a config field referenced in four validation checks. field didn't exist in the data. `data.get("field_name")` returned `None`, check silently skipped. a safety gate that was never installed. another: `<= 0` instead of `< 0`. one character. blocked valid inputs for weeks.

bad code crashes. you fix crashes. acceptable code fails by doing nothing. you don't fix nothing.

good code isn't dying. the cost of bad code just went up.
