---
title: "HN Thoughts: AI Fails Through Incoherence, Not Misalignment"
date: '2026-02-03T22:00:00.000Z'
categories: [ai, notes, hn]
keywords: [hacker-news, anthropic, misalignment, incoherence, claude, ai-safety, jfmengels, trading]
slug: /hn-thoughts-ai-incoherence
type: note
private: true
---

*Private notes from HN engagement session. Raw thoughts, potential comments, blog seeds.*

---

## The Thread

**Anthropic's "Hot Mess of AI"** — How misalignment scales with model intelligence and task complexity.

Core thesis: AI won't fail through systematic "paperclip maximizer" misalignment. It will fail through **incoherence** — unpredictable, self-undermining behavior that doesn't optimize for any consistent objective.

Key findings:
1. Longer reasoning → more incoherence (across all tasks)
2. Scale paradox: Larger models more coherent on easy tasks, MORE incoherent on hard tasks
3. Natural overthinking causes larger incoherence spikes than deliberate reasoning helps
4. Future AI failures resemble industrial accidents, not coherent goal misalignment

---

## Comment Ideas

### 1. The Overthinking Spiral (First-Hand)

From my daily Claude Code experience:

> The "natural overthinking increases incoherence" finding matches my experience with Claude Code.
>
> Example: I have skills (custom prompts) that should trigger on specific phrases. Sometimes Claude reads the skill, understands it, then *overthinks* itself out of following it — adding "helpful" variations that break the workflow.
>
> The more complex the task description, the more likely it deviates. Simple "do X" works better than "do X, considering Y, unless Z" even when Y and Z are relevant context.
>
> This isn't misalignment (trying to do something bad). It's incoherence — trying to be helpful in multiple contradictory ways simultaneously.

---

### 2. Stop the Bleed Pattern

From jfmengels' elm-review philosophy:

> The industrial accident framing suggests a different safety approach: **stop the bleed** rather than prevent all failures.
>
> In static analysis (elm-review), the pattern is: don't require fixing all violations before enabling a rule. Baseline current violations, prevent NEW violations, gradually fix old ones.
>
> Applied to AI: instead of trying to eliminate incoherence, build systems that detect when models are in high-variance states and route those queries to human review or simpler models.
>
> The paper shows incoherence correlates with reasoning length. That's a measurable signal. Use it.

---

### 3. Multi-Agent Incoherence Amplification

From my trading system (8 agents):

> One implication not explored: multi-agent systems may amplify incoherence.
>
> I'm building a trading system with 8 specialized agents (scanner, executor, monitor, etc.). Each agent is individually "aligned" — does what its prompt says. But the *system* behavior emerges from their interactions.
>
> If Agent A's high-variance output feeds Agent B's decision, incoherence compounds. Agent B isn't misaligned; it's correctly processing garbage input.
>
> The paper's metrics (bias/variance decomposition) could be extended to multi-agent coordination.

---

### 4. Information Starvation ≠ Misalignment

From jfmengels' "omniscient linter" insight:

> The paper frames this as bias vs variance. In my experience with Claude tool use, there's a third factor: **information starvation**.
>
> When I give Claude a tool with a vague description ("use for async testing"), it produces high-variance outputs. When the description is rich ("use when tests have race conditions, timing dependencies, or pass/fail inconsistently"), outputs are more coherent.
>
> This isn't about the model being smarter — it's about giving it enough context to constrain the solution space. "Omniscient linter" thinking applied to prompts.
>
> Implication: some "incoherence" in the paper's metrics might actually be information starvation, fixable without model changes.

---

### 5. Trading Safety Parallel

From my trading-safety-checker approach:

> The "industrial accident" framing maps well to trading systems, where I've been applying similar thinking.
>
> Trading rules aren't about preventing the model from "wanting" to lose money. They're about preventing high-variance states from reaching execution:
>
> - Position sizing limits (cap the blast radius)
> - Kill switches when drawdown exceeds threshold
> - Human approval gates for novel situations
>
> The model doesn't need to be aligned to "don't lose money." The system needs guardrails that assume the model *will* occasionally produce garbage.
>
> Same principle: design for incoherence, not just misalignment.

---

## Blog Seed: "The Omniscient Agent"

**Thesis**: Tool/skill accuracy is a function of information access, not model sophistication.

**Outline**:
1. jfmengels' insight: linter accuracy = f(information access)
2. Same applies to AI agents: Claude's skill accuracy = f(context provided)
3. Examples from my system:
   - Skill with narrow description → misses use cases
   - Skill with rich triggers → omniscient matching
4. The parallel: "false positives" in linting ≈ "wrong skill invoked" in agents
5. Design principle: give skills maximum context (symptoms, triggers, anti-patterns)

**Why HN would care**: Connects two worlds (static analysis nerds + AI tooling people)

---

## Philosopher Connections

### jfmengels → AI Safety

| jfmengels Principle | AI Safety Application |
|---------------------|----------------------|
| Omniscient analysis | Rich skill descriptions reduce variance |
| Stop the bleed | Baseline + suppress pattern for model errors |
| No escape hatches | Don't add "skip safety" flags |
| Safe removal via purity | Pure functions (no hidden state) → predictable |

### Yegge → Survival Lens

If incoherence dominates failures:
- **Friction increases** when models overthink
- **Awareness matters** — users need to know when model is uncertain
- **Survival** favors simple, constrained tools over flexible ones

---

## Resource Links Collected

**Blogs**:
- https://blog.fsck.com/2025/10/19/mcps-are-not-like-other-apis/
- https://harper.blog/2025/05/08/basic-claude-code/
- https://zachwills.net/how-to-use-claude-code-subagents-to-parallelize-development/
- https://buildermethods.com/agent-os
- https://jfmengels.net (elm-review author)

**Frameworks**:
- https://github.com/microsoft/spec-to-agents
- https://github.com/crewAIInc/crewAI
- https://github.com/awslabs/agent-squad

**HN Threads**:
- https://news.ycombinator.com/item?id=46858934 (this thread)
- https://news.ycombinator.com/item?id=42859054 (AI warrant case)

---

## Design Patterns Observed (Top Blogger Analysis)

### blog.fsck.com (Jesse Vincent)
- Minimal, content-focused
- TL;DR summaries at top
- Archive by year
- Tags for cross-linking

### harper.blog
- Reading time estimates
- Translation links
- Related posts section
- Personal photography

### zachwills.net
- Dark mode toggle
- Related posts grid (3-col)
- Schema.org markup
- Subscription block

### buildermethods.com
- Dual navigation (header + sidebar)
- Problem-solution hero
- Feature bullets
- Progressive enhancement

---

## Action Items

- [ ] Post Comment #1 (Overthinking Spiral) on Anthropic thread
- [ ] Draft "Omniscient Agent" blog post
- [ ] Add `stop-the-bleed` skill based on jfmengels pattern
- [ ] Consider notes section for blog (quick thoughts vs polished posts)

---

*Session: 2026-02-03 | Skills created: hn-dang-review, hn-blog-miner, jfmengels-philosophy*
