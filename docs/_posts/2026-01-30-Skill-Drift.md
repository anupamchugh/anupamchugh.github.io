---
published: true
title: "Skill Drift: 42 Skills in Claude. 40 in Codex."
date: '2026-01-30T12:00:00.000Z'
categories: [ai, tools]
keywords: [claude-code, codex, multi-agent, shadowbook, drift-detection]
slug: /skill-drift
---
published: true

Specs drift from code. That was [the vibe-clock problem](https://chughgpt.substack.com/p/the-vibe-clock-drift-problem)—you update the spec at 3am, but the code keeps building the old version.

Now there's a second drift: **skills drift between agents.**

## The Problem

You teach Claude Code a new skill. A validation gate. A debugging workflow. Something you'll need again.

```bash
# Claude Code learns a skill
~/.claude/skills/validation-gates/SKILL.md
```

Later, you switch to Codex CLI for a background task. It lacks the skill. **Same engineer, same machine, different agent, missing knowledge.**

Why? Skills live in different directories:

- **Claude Code** → `.claude/skills/`
- **Codex CLI** → `~/.codex/skills/`

No shared memory. No automatic sync. One agent accumulates skills. The other falls behind.

**42 skills in Claude Code. 40 in Codex. 2 missing.**

Those 2 might be the ones you need when Codex runs your CI workflow. It fails. You debug for an hour. The skill existed—just not where Codex could see it.

## The Solution: Preflight Checks

Shadowbook already catches spec drift. Now it catches skill drift too.

```bash
bd preflight --check
```

Output:

```
✓ Skills synced
  Command: skill-sync audit

✓ Tests pass
✓ Lint passes
✓ Nix hash current
✓ Version sync

5/5 checks passed
```

When skills drift:

```
⚠ Skills synced
  Command: skill-sync audit
  Warning: Claude: 42 skills, Codex: 40 skills (gap: 2) (use --auto-sync to fix)
```

Fix it:

```bash
bd preflight --check --auto-sync
```

Done. Skills mirrored. Both agents share the same knowledge.

## CI Integration

The skill-sync command supports CI-friendly flags:

```bash
# In your CI pipeline
/skill-sync audit --check-only    # Exit 0=synced, 1=drift
/skill-sync audit --json          # Machine-readable output
```

JSON output for parsing:

```json
{
  "status": "drift_detected",
  "agents": {
    "claude_code": 42,
    "codex": 40
  },
  "missing": ["validation-gates", "defense-in-depth"],
  "invalid": []
}
```

Gate your builds. If skills drift, fail fast.

## The Bigger Picture

Multi-agent workflows need infrastructure.

- **Specs** → `bd spec scan` catches code drifting from requirements
- **Skills** → `bd preflight` catches agents drifting from each other
- **Issues** → `bd ready` catches work blocked by dependencies

These layers compound. Specs without issues mean nothing. Issues without skills can't execute. Skills without sync cause silent failures.

Shadowbook ties them together. One preflight check. Multiple drift types. Zero surprises.

---
published: true

Specs drift from code. Skills drift between agents. Both cause the same failure mode: work that builds the wrong thing.

Catch the drift. Fix it automatically. Ship code that matches what you intended.

---
published: true

*This post extends [The Vibe-Clock Drift Problem](https://chughgpt.substack.com/p/the-vibe-clock-drift-problem). Shadowbook is built on [beads](https://github.com/steveyegge/beads). Try it: [github.com/anupamchugh/shadowbook](https://github.com/anupamchugh/shadowbook)*
