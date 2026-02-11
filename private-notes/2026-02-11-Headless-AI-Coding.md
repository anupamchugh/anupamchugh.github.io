# Headless AI Coding: codex exec vs claude -p

Source: Discovery while queuing overnight tasks (Feb 11, 2026)

## The Two Headless Modes

Both major AI coding CLIs have fire-and-forget modes. Almost nobody uses them.

**Codex CLI:**
```bash
codex exec "refactor auth module"       # headless, autonomous
codex exec --json "fix all lint errors" # structured output
```

**Claude Code:**
```bash
claude -p "refactor auth module"                          # headless
claude -p --output-format json --max-turns 20 "prompt"    # structured + bounded
```

Same idea, different ecosystems. Codex has a GitHub Action. Claude has `--allowedTools` for permission control.

## What Makes This Interesting

These aren't chat. They're **autonomous execution runtimes** with full filesystem access, git, and tool use. The implications:

1. **Overnight workers** — Queue 5 tasks before bed, wake up to PRs
2. **CI/CD agents** — Not just linting. Actual code changes on every push
3. **Pipeline composition** — Chain them: Claude analyzes, Codex implements, Claude reviews
4. **Fan-out parallelism** — 10 `claude -p` processes on 10 different files simultaneously

## Brainstorm: Mixing Them Together

| Pattern | How | Why |
|---|---|---|
| **Claude plans, Codex executes** | `claude -p "write a plan for X" > plan.md && codex exec "follow plan.md"` | Claude is better at architecture, Codex at grunt work |
| **Parallel fan-out** | `for f in src/*.py; do claude -p "fix types in $f" & done` | 10x throughput on independent files |
| **Review loop** | `codex exec "implement feature" && claude -p "review the last commit"` | Different model catches different bugs |
| **Nightly maintenance** | Cron job: `claude -p "run bd ready, pick top 3, fix them"` | Wake up to closed beads |
| **A/B model comparison** | Run same prompt on both, diff the outputs | Find which model handles which task better |
| **Escalation chain** | `claude -p --max-turns 5 "fix X" || codex exec "fix X"` | If one fails, try the other |

## MVP Ideas

### 1. `nightshift` — Overnight Task Runner
A wrapper that reads your beads/issues, generates prompts, fans out to N headless agents, commits results, and sends a morning summary to Telegram.

### 2. `arena` — Model A/B Testing for Code
Run the same coding task on Claude + Codex + Gemini in parallel. Diff outputs. Score by: compiles? tests pass? lines changed? Human picks winner. Builds a dataset of "which model for which task."

### 3. `pipeliner` — Composable AI Coding Pipelines
YAML-defined pipelines:
```yaml
steps:
  - agent: claude -p
    prompt: "analyze {file} for security issues"
    output: findings.json
  - agent: codex exec
    prompt: "fix issues in findings.json"
  - agent: claude -p
    prompt: "review the fix commit"
```

### 4. `swarmer` — Parallel File Processor
```bash
swarmer --agent "claude -p" --pattern "backend/**/*.py" --prompt "add type hints to {file}"
```
Fans out one agent per file. Collects results. Auto-commits.

## Yegge Survival Check

| Idea | Survives? | Why |
|---|---|---|
| nightshift | YES (28/30) | Solves real pain (overnight idle). One user (me) uses it tomorrow. Compounds. |
| arena | MAYBE (20/30) | Fun but who needs it daily? Research tool, not workflow tool. |
| pipeliner | NO (15/30) | YAML pipeline = framework. Frameworks die. Shell scripts + `&&` already work. |
| swarmer | YES (26/30) | Dead simple. One command. Immediate value. Could be a 50-line bash script. |

**Verdict:** nightshift and swarmer survive. Arena is a weekend project. Pipeliner is over-engineered.

## The Real Insight

The interesting thing isn't the tools — it's that **headless AI coding is undersold**. Everyone demos the chat interface. Nobody shows the cron job that fixes 10 beads overnight. The boring automation is where the compound returns live.
