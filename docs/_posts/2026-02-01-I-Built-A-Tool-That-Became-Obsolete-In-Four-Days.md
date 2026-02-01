---
title: "I Built a Tool That Became Obsolete in Four Days"
date: '2026-02-01T18:00:00.000Z'
categories: [satire, tools]
keywords: [declutter, claude-code, memory-leak, yegge, software-survival, indie-dev]
slug: /i-built-a-tool-that-became-obsolete-in-four-days
---

On January 27th, 2026, Claude Code kept freezing on my workspace.

938MB of log files. 1.2GB of node_modules. DerivedData the size of a small country.

I did what any rational engineer does when their tools break: I built another tool.

## The Birth of Declutter

Four hours later, `@declutter` was born.

```bash
@declutter              # Scan workspace, show report
@declutter --fix        # Auto-generate .claudeignore
```

It detected bloat, calculated token costs, and generated ignore files. Beautiful architecture. MCP tool backed by a skill. Tests passing. README polished. GitHub repo created.

I was proud.

## The Death of Declutter

On January 31st, Anthropic posted this:

> **Claude Code Memory Leak**
>
> Users encountered memory leaks in Claude Code version 2.1.27.
>
> **Resolution:** Update to 2.1.29.
>
> *Total incident duration: 1 hour.*

[status.claude.com/incidents/rl6pphjrc2r4](https://status.claude.com/incidents/rl6pphjrc2r4)

One hour to fix. Four days after I started building my "solution."

I had built a tool that solved a bug that was already being fixed upstream.

## The Five Stages of Tool Grief

**Denial**: "My tool is still useful! What about token efficiency? Context budgeting?"

**Anger**: "Why didn't I check the GitHub issues first? There was probably already a PR!"

**Bargaining**: "Maybe I can pivot to universal .ignore generation? Or codebase tokenization?"

**Depression**: *stares at 47 commits to a repo nobody will use*

**Acceptance**: `gh repo archive anupamchugh/declutter --yes`

## The Lesson: Check the GitHub Issues First

Before building a tool that fixes something broken:

1. **Search GitHub Issues** for the project you're fixing
2. **Check open PRs** — someone might already have a fix in review
3. **Read the status page** — it might be a known incident
4. **Wait 48 hours** — urgency is the enemy of durability

If I had spent 5 minutes on GitHub before spending 4 hours building, I would have found [issue #22042](https://github.com/anthropics/claude-code/issues/22042) and a fix already in progress.

## Yegge's Framework Predicted This

I ran my tool through Steve Yegge's Software Survival 3.0 framework:

| Lever | Score | Why |
|-------|-------|-----|
| Insight Compression | Low | Agents already know ignore patterns |
| Substrate Efficiency | High | Pure CPU file scanning |
| Broad Utility | **Low** | Only helps Claude + large workspace + freezing |
| Low Friction | Medium | Easy to use |
| Awareness | Low | Nobody knows it exists |
| Human Coefficient | Low | Solo project |

**Verdict: Below 1.0 — Will not survive.**

The killer was "Broad Utility." My tool required a triple-AND condition:
- Claude Code (specific tool)
- Large workspace (specific size)
- Memory issues (specific bug)

When the bug got fixed, two-thirds of my market disappeared overnight.

## The Survival Criteria

Tools that survive fix *permanent* problems, not temporary bugs:

| Survives | Dies |
|----------|------|
| Git (version control is permanent) | "Git GUI that fixes specific merge bug" |
| Prettier (formatting is permanent) | "Linter that fixes ESLint 8.2 quirk" |
| ffmpeg (media conversion is permanent) | "Tool that works around macOS 14.1 codec issue" |

If your tool can be killed by a patch, it's not a tool. It's a workaround.

## What I Should Have Built Instead

Pivots that would have survived:

| Alternative | Why It Survives |
|-------------|-----------------|
| **@context-budget** | Token cost calculator for ANY LLM tool |
| **Universal .ignore** | Generate ignores for git, docker, cursor, copilot |
| **Codebase Tokenizer** | Compare token efficiency across projects |

These solve *categories* of problems, not specific bugs.

## The Graveyard of Good Intentions

```
~/Desktop/workspace/
├── declutter/           # RIP 2026-01-27 to 2026-02-01
├── cursor-patcher/      # Fixed a bug they fixed in 0.42
├── vscode-mem-fix/      # Extension store rejected it
└── tools-that-mattered/ # (empty)
```

Every one of these started with "Ugh, this is broken, let me fix it."

Every one ended with "Oh, they fixed it upstream."

## The Postmortem Template

For my next urge to build a workaround tool:

```markdown
## Pre-Build Checklist

- [ ] Searched GitHub issues for the broken thing
- [ ] Checked open PRs for fixes in progress
- [ ] Read the changelog for recent fixes
- [ ] Checked status page for known incidents
- [ ] Waited 48 hours to see if it resolves
- [ ] Asked in Discord/community if others have the issue
- [ ] Confirmed the problem exists in latest version

If any of these reveal a fix in progress: STOP. Wait.
```

## The Epitaph

Declutter is now archived on GitHub:

[github.com/anupamchugh/declutter](https://github.com/anupamchugh/declutter)

The README explains why it's dead. The commit history shows four days of work. The archive banner shows the moment I accepted reality.

RIP Declutter. You solved a problem that didn't need solving.

## The Real Lesson

**Build for durability, not urgency.**

When your tools break, the urge to "just fix it yourself" is strong. Resist. Check if someone else is already fixing it. Check if the fix is coming.

Build tools that solve *permanent* problems. Leave the temporary bugs to the maintainers.

And if you do build a workaround tool, at least make it funny when you archive it.

---

*Declutter lived for 4 days, 3 hours, and 47 minutes. It is survived by its creator's ego and a very thorough README.*

*The memory leak that killed it was fixed in [1 hour](https://status.claude.com/incidents/rl6pphjrc2r4).*
