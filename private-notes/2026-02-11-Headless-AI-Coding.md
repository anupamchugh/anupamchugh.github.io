# I Didn't Know My AI Could Run Without Me

i was queuing a codex task from inside claude code when i noticed the `exec` subcommand. waited — claude has one too? `-p`? since when?

turns out both CLIs have had headless modes for months. i've been sitting in chat sessions this whole time.

## the commands i didn't know existed

```bash
# claude code
claude -p "fix the failing tests"

# codex
codex exec "fix the failing tests"
```

that's it. prompt in, code changes out. no chat. no TUI. full filesystem, git, and tool access.

## claude -p: the full flag list

i had to dig for these. most aren't in the obvious docs.

```bash
# basics
claude -p "prompt"                              # one-shot, exits when done
claude -p --output-format json "prompt"          # structured output
claude -p --output-format stream-json "prompt"   # real-time streaming

# control
claude -p --max-turns 10 "prompt"                # limit iterations
claude -p --max-budget-usd 2.00 "prompt"         # cost cap
claude -p --model opus "prompt"                  # pick model

# permissions
claude -p --allowedTools "Bash,Read,Edit" "prompt"       # auto-approve these tools
claude -p --permission-mode accept "prompt"               # approve everything
claude -p --dangerously-skip-permissions "prompt"          # nuclear option

# context
claude -p --system-prompt "You are a Python expert" "prompt"
claude -p --append-system-prompt-file ./rules.txt "prompt"
claude -p --add-dir ../other-project "prompt"

# sessions (this one surprised me)
claude -p "start the review" --output-format json          # returns session_id
claude -p --resume "$SESSION_ID" "continue the review"     # picks up where it left off
claude -p --continue "next step"                           # resume most recent session
claude -p --resume "$ID" --fork-session "try different approach"

# structured output with schema validation
claude -p "extract function names" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}'

# piping
echo "explain this" | claude -p
cat error.log | claude -p "what's the root cause?"
gh pr diff | claude -p "review for security issues"

# CI/CD safe
claude -p "analyze code" \
  --max-turns 3 --max-budget-usd 1.00 \
  --no-session-persistence \
  --output-format json | jq -r '.result'
```

## codex exec: the flags

```bash
codex exec "prompt"                    # headless
codex exec --json "prompt"             # JSON Lines events
codex exec --model o4-mini "prompt"    # pick model
codex exec --auto-approve "prompt"     # no permission prompts
```

less flags than claude but it has a [github action](https://developers.openai.com/codex/github-action/) for CI.

## what surprised me

- **session resume in headless.** `claude -p --resume $ID` means you can build multi-step pipelines where each step picks up context from the last
- **budget caps.** `--max-budget-usd 2.00` prevents runaway overnight tasks
- **schema validation.** `--json-schema` means claude returns structured data, not prose. useful for tools that consume agent output
- **fork sessions.** try two different approaches from the same starting point

## mixing them

```bash
# claude plans, codex executes
claude -p "write a refactoring plan for auth" > plan.md
codex exec "follow plan.md step by step"

# parallel fan-out
for f in backend/api/*.py; do
  claude -p "add type hints to $f" &
done
wait

# implement + review (different models catch different bugs)
codex exec "implement the feature"
claude -p "review the last 3 commits"

# escalation
claude -p --max-turns 5 "fix the test" || codex exec "fix the test"

# multi-step with session resume
SID=$(claude -p "analyze the codebase" --output-format json | jq -r '.session_id')
claude -p --resume "$SID" "now fix the top 3 issues you found"
```

## five runnable demos

**1. ABOUTME headers on every file**
```bash
for f in $(find backend/core -name "*.py"); do
  claude -p "add a 2-line ABOUTME comment to $f. change nothing else." &
done
wait && git add -A && git commit -m "docs: ABOUTME headers"
```

**2. nightly test fixer**
```bash
#!/bin/bash
FAILS=$(cd backend && uv run pytest tests/ -x --tb=short 2>&1 | tail -20)
if echo "$FAILS" | grep -q "FAILED"; then
  claude -p "these tests fail:\n$FAILS\nfix them. run tests to verify." \
    --max-budget-usd 3.00 --max-turns 10
  git push
fi
```

**3. multi-model review**
```bash
claude -p "review this PR diff for bugs" > review-claude.md &
codex exec "review this PR diff for bugs" > review-codex.md &
wait
claude -p "synthesize: $(cat review-claude.md review-codex.md)"
```

**4. structured data extraction**
```bash
claude -p "list all API endpoints in backend/api/" \
  --json-schema '{"type":"object","properties":{"endpoints":{"type":"array","items":{"type":"string"}}}}' \
  --output-format json | jq '.structured_output.endpoints'
```

**5. overnight beads worker**
```bash
READY=$(bd ready --json | jq -r '.[0:3][] | .id + ": " + .title')
claude -p "open tasks:\n$READY\nfix each, test, commit with bead id, close with bd close." \
  --max-budget-usd 10.00 --max-turns 30
```

## fire-and-forget from telegram

[takopi](https://banteg.xyz/posts/takopi/) bridges Telegram to coding agents. text or voice-note from phone, agent runs in your repo, result streams back.

```bash
takopi claude    # polls telegram, dispatches to claude code
takopi codex     # same, but codex
takopi opencode  # opencode engine
```

three modes:
- **assistant** — ongoing chat. `/new` resets
- **workspace** — forum topics bound to repos. each topic = isolated worktree
- **handoff** — resume lines you paste into terminal

the actual workflow: you're on the train. voice-note "fix the failing test in test_binance_state.py". laptop at home runs the agent. diff arrives on Telegram before your stop.

## existing tools

- [myclaude](https://github.com/cexll/myclaude) — multi-engine orchestration (Claude + Codex + Gemini)
- [claude-flow](https://github.com/ruvnet/claude-flow) — swarm orchestration with parallel modes
- [ccswarm](https://github.com/nwiizo/ccswarm) — worktree isolation per agent
- [codex github action](https://developers.openai.com/codex/github-action/) — codex exec in CI

## gaps

- no `codex exec --plan file.md` or `claude -p --plan file.md`. plans go in the prompt
- no cross-agent memory. claude doesn't know what codex did
- no built-in fan-out. you write bash loops
- laptop-bound. cloud agents coming but not here

## title options for a real post

- "I Didn't Know My AI Could Run Without Me"
- "The Commands Nobody Told Me About"
- "Headless AI Coding: What Happens When You Stop Chatting"
- "Your AI Coding Agent Has a Cron Job Mode"
- "claude -p and codex exec: The Fire-and-Forget Guide"

---

*this note exists because i genuinely didn't know `codex exec` and `claude -p` existed until i stumbled on them. if i missed them, others did too.*
