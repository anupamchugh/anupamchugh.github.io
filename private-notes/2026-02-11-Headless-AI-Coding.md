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

## fire-and-forget from telegram (takopi)

this is the missing piece. [takopi](https://banteg.xyz/posts/takopi/) bridges Telegram to coding agents. you text or voice-note from your phone, it runs the agent in your repo, streams progress back.

```bash
# takopi supports multiple engines out of the box
takopi claude    # runs claude code as the backend
takopi codex     # runs codex as the backend
takopi opencode  # runs opencode as the backend
```

three modes:
- **assistant** — ongoing conversation. `/new` resets context
- **workspace** — telegram forum topics bound to repos/branches. each topic = isolated worktree
- **handoff** — reply-to-continue with resume lines you can paste into terminal

the flow:
1. takopi polls Telegram for new messages (runs as a daemon via launchd)
2. you send "fix the failing test in test_binance_state.py" from your phone
3. takopi dispatches to `claude` or `codex` engine in your repo
4. agent reads code, writes fix, runs tests
5. result streams back to your Telegram chat

voice notes work too — takopi transcribes and runs it like any text message.

```bash
# setup (one time)
takopi init                    # register repo
takopi --onboard               # connect telegram bot
takopi claude                  # start polling

# keep it alive across terminal closes
# (launchd daemon — see takopi docs)
```

**why this matters for headless coding:** you're on the train, you voice-note "add type hints to the trading module", your laptop at home runs the agent, you get the diff back on Telegram before your stop. no terminal needed.

## existing tools

- [myclaude](https://github.com/cexll/myclaude) — multi-agent orchestration across Claude, Codex, Gemini
- [claude-flow](https://github.com/ruvnet/claude-flow) — swarm orchestration. autopilot, ultrapilot (3-5x parallel), pipeline modes
- [ccswarm](https://github.com/nwiizo/ccswarm) — git worktree isolation per agent. each agent = own branch
- [cli-agent-orchestrator](https://aws.amazon.com/blogs/opensource/introducing-cli-agent-orchestrator-transforming-developer-cli-tools-into-a-multi-agent-powerhouse/) — AWS's take. routes to best available agent
- [codex github action](https://developers.openai.com/codex/github-action/) — codex exec in CI on every push

## what's missing

- **no native plan file support** — `codex exec --plan plan.md` doesn't exist. you embed the plan in the prompt
- **no cross-agent memory** — claude doesn't know what codex did. shared files or DB needed
- **no built-in fan-out** — bash loops work but a 50-line `swarmer` tool would be cleaner
- **laptop-bound** — agents run locally. cloud execution coming but not here yet
- **no takopi multi-engine** — can't say "send this to claude AND codex". one engine per session

## the real insight

everyone demos the chat interface. nobody shows the voice note from the train that closes 3 issues by the time you get home. headless + telegram is the actual compound return.
