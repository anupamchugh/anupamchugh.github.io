# HN Sandboxing Thread Ideas

Source: https://news.ycombinator.com/item?id=46874139
Blog: https://blog.senko.net/sandboxing-ai-agents-in-linux
Related: https://news.ycombinator.com/item?id=46699324 (Why is everyone DIYing sandboxes?)

## Key Insight

> "There's no OAuth for syscalls yet" - varshith17

Different agents need different permissions:
- One needs SSH but not rm
- Another needs filesystem writes but not network
- No standard fits everyone

## The Real Debate

| Position | Who | Argument |
|----------|-----|----------|
| DIY is dangerous | rvz | One libc function away from escape |
| No standard fits | varshith17 | OAuth for syscalls doesn't exist |
| It's not just isolation | wassel | Agents fail from flaky environments, not just wrong models |
| Simple > complex | kaffekaka | Bash + Docker beats overcomplicated tools |

## Tools Landscape

- **Fence** (78 pts) - bubblewrap + proxy filtering
- **packnplay** - Docker + worktrees + credentials
- **senko.net script** - bubblewrap only, simple
- **Anthropic sandbox-runtime** - official, Seatbelt on macOS

## Ideas for My Codebase

### 1. Permission DSL for Agents
Build a declarative permission system:
```yaml
agent: code-reviewer
permissions:
  filesystem: read-only
  network: [github.com, api.anthropic.com]
  shell: [git, npm]
  deny: [rm, curl]
```
"OAuth for syscalls" as a skill/spec.

### 2. Blog: Why We're All DIYing Agent Sandboxes
Not about HOW to sandbox, but WHY there's no standard:
- Different agents, different needs
- Task isolation (beads) vs system isolation (containers)
- How worktrees help agent convergence

### 3. Session vs System Isolation
My beads isolate TASKS. Sandboxes isolate SYSTEMS.
How do they compose?
- Bead = what the agent is working on
- Sandbox = what the agent can touch
- Worktree = where the agent works

### 4. Credential Forwarding Pattern
From packnplay: macOS Keychain → container forwarding.
Could my skills benefit from structured credential access?

## Comment Draft (if posting)

> Related: "Ask HN: Why are so many rolling out their own AI/LLM agent sandboxing solution?" [1] - consensus was "there's no OAuth for syscalls yet."
>
> This bubblewrap approach is clean for single-project isolation. For multi-project work, packnplay [2] takes a Docker approach with automatic git worktree management.
>
> Tradeoff: bubblewrap is lighter but needs manual strace debugging. Docker is heavier but reproducible.
>
> [1] https://news.ycombinator.com/item?id=46699324
> [2] https://github.com/obra/packnplay

---
Date: 2026-02-04
Status: Ideas captured, not yet acted on
