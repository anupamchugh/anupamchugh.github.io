# Headless AI Coding

i was queuing a codex task from inside claude code and realized both CLIs have fire-and-forget modes. almost nobody talks about them.

## the two commands

```bash
# codex — openai's cli
codex exec "refactor the auth module"
codex exec --json "fix lint errors"        # structured output for scripts

# claude code — anthropic's cli
claude -p "refactor the auth module"
claude -p --output-format json "fix lint"  # same idea, different flag
claude -p --max-turns 20 --allowedTools "Bash,Read,Write,Edit" "prompt"
```

both give you an autonomous coding agent that reads files, writes code, runs tests, and commits. no chat UI. just a prompt in, code changes out.

codex has a [github action](https://developers.openai.com/codex/github-action/). claude has `--allowedTools` for fine-grained permissions. cursor is building one too.

## why this matters

- these aren't chat completions. they have **full filesystem + git + tool access**
- they can run for 20+ turns autonomously — read code, write fixes, run tests, iterate
- they work in CI, cron jobs, pre-commit hooks, or just a background terminal tab
- you can run 10 of them in parallel on different files

## orchestration patterns

this is where it gets interesting. you can **mix models**:

```bash
# pattern 1: claude plans, codex executes
claude -p "analyze this codebase and write a refactoring plan" > plan.md
codex exec "follow plan.md step by step, commit after each step"

# pattern 2: parallel fan-out (one agent per file)
for f in backend/api/*.py; do
  claude -p "add type hints to $f" &
done
wait

# pattern 3: implement + review (different model catches different bugs)
codex exec "implement the feature in SPEC.md"
claude -p "review the last 3 commits for bugs and security issues"

# pattern 4: escalation (if one fails, try the other)
claude -p --max-turns 5 "fix the failing test" || codex exec "fix the failing test"

# pattern 5: overnight cron
# crontab: 0 2 * * * /path/to/nightshift.sh
claude -p "read beads with bd ready, pick top 3 by priority, fix them, commit each"
```

## mini demos

### demo 1: add ABOUTME headers to every python file
```bash
for f in $(find backend/core -name "*.py"); do
  claude -p "read $f, add a 2-line ABOUTME comment at the top describing what this file does. don't change anything else." &
done
wait
git add -A && git commit -m "docs: add ABOUTME headers to core modules"
```

### demo 2: nightly test fixer
```bash
#!/bin/bash
# run at 2am via cron
cd /path/to/project
FAILS=$(cd backend && uv run pytest tests/ -x --tb=short 2>&1 | tail -20)
if echo "$FAILS" | grep -q "FAILED"; then
  claude -p "these tests are failing:\n$FAILS\nfix them. run tests after to verify."
  git push
fi
```

### demo 3: multi-model code review
```bash
# get two opinions
claude -p "review the diff in this PR for bugs" > review-claude.md &
codex exec "review the diff in this PR for bugs" > review-codex.md &
wait
claude -p "synthesize these two reviews into one: $(cat review-claude.md review-codex.md)"
```

### demo 4: fan-out refactor with takopi-style dispatch
```bash
# like banteg's takopi but for coding tasks
SYMBOLS=("NIFTY" "BANKNIFTY" "SBIN" "RELIANCE")
for sym in "${SYMBOLS[@]}"; do
  claude -p "scan backend/ for hardcoded references to $sym, replace with instruments cache lookup" &
done
wait
```

### demo 5: overnight beads worker
```bash
#!/bin/bash
# reads your issue tracker, picks work, does it
READY=$(bd ready --json | jq -r '.[0:3][] | .id + ": " + .title')
claude -p "here are 3 open tasks:\n$READY\nfor each: read the bead, implement the fix, run tests, commit with the bead id in the message, close the bead with bd close."
```

## existing tools doing this

- [myclaude](https://github.com/cexll/myclaude) — multi-agent orchestration across Claude, Codex, Gemini. uses a wrapper to abstract CLI differences
- [claude-flow](https://github.com/ruvnet/claude-flow) — swarm orchestration for Claude Code. autopilot, ultrapilot (3-5x parallel), pipeline modes
- [ccswarm](https://github.com/nwiizo/ccswarm) — git worktree isolation per agent. each agent works on its own branch
- [cli-agent-orchestrator](https://aws.amazon.com/blogs/opensource/introducing-cli-agent-orchestrator-transforming-developer-cli-tools-into-a-multi-agent-powerhouse/) — AWS's take. routes tasks to the best available CLI agent
- [codex github action](https://developers.openai.com/codex/github-action/) — run codex exec in CI on every push
- banteg's [takopi](https://banteg.xyz/posts/takopi/) — not headless coding, but the dispatch pattern (workflows + voice notes + background polling) maps directly to headless agent orchestration

## what's missing

- **no native plan file support** — you can't `codex exec --plan plan.md`. you pass the plan as part of the prompt and hope it reads it
- **no cross-agent memory** — claude doesn't know what codex did last run. you'd need shared files or a DB
- **no built-in fan-out** — you're writing bash loops. a `swarmer` tool that parallelizes across files would be 50 lines of bash and immediately useful
- **laptop-bound** — codex automations only run while your laptop is on. cloud execution is coming but not here yet

## the real insight

everyone demos the chat interface. nobody shows the cron job that closes 3 issues overnight. headless mode is undersold. the boring automation is where the compound returns live.
