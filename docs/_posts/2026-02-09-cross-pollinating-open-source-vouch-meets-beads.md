---
draft: true
title: "Cross-pollinating open source: what a trust system can learn from an issue tracker"
date: '2026-02-09T09:00:00.000Z'
categories: [open-source]
keywords: [open-source, vouch, beads, trust, git, contributions]
slug: /cross-pollinating-open-source-vouch-meets-beads
published: false
---

Mitchell Hashimoto released [vouch](https://github.com/mitchellh/vouch) last week. It's a trust system for open source: maintainers vouch for contributors, and unvouched PRs get auto-closed. The Ghostty project already uses it. The motivation is blunt — AI tools make it trivially easy to generate plausible-looking but low-quality contributions, so the old "trust by default" model is dead.

I've been building [shadowbook](https://github.com/anupamchugh/shadowbook), a fork of Steve Yegge's beads issue tracker that adds spec drift detection and token-aware compaction. Different problem domain entirely. But reading through vouch's open issues, three patterns from beads mapped directly to gaps in vouch.

## The bug: bare git push in a concurrent world

Vouch's GitHub Actions commit changes to a `VOUCHED.td` file when a maintainer comments "vouch" on an issue. The action does a `git push` at the end. No retry. No pull. No conflict handling.

When two maintainers vouch different contributors within seconds, the second push fails silently. Issue [#24](https://github.com/mitchellh/vouch/issues/24) — tagged `help wanted`.

In beads, `bd sync` has been handling this exact problem for months. The `.td` format is alphabetically sorted (one username per line), which means concurrent additions for different users merge cleanly via rebase. The fix is a pull-rebase-retry loop:

```nushell
mut attempts = 0
loop {
  $attempts += 1
  let result = git push | complete
  if $result.exit_code == 0 { break }
  if $attempts >= 3 {
    print $"Push failed after ($attempts) attempts"
    exit 1
  }
  git pull --rebase
}
```

Eight lines. Applied to both `manage-by-issue` and `manage-by-discussion` actions. [Issue opened](https://github.com/mitchellh/vouch/issues/34), branch pushed to fork, waiting to get vouched before the PR can land.

## The design gap: trust decay

Vouch's second most discussed issue is [#21](https://github.com/mitchellh/vouch/issues/21) — once someone is vouched, they stay vouched forever. No expiration. No activity check. A vouched account that goes dormant for two years and then gets compromised? Still trusted.

Beads has the same problem with specs. A spec written six months ago drifts from reality as the code evolves. Shadowbook's answer: hash-based drift detection. Every `bd spec scan` computes file hashes and compares against the registry. Changed hash = flagged drift. `last_scanned_at` timestamps track staleness.

The same pattern works for trust:

- **Vouched-at timestamp** — when was this user added? Git blame on the `.td` file gives you this for free, no format changes needed.
- **Activity signal** — last merged PR date via GitHub API. No contribution in N months = flagged for review.
- **Explicit renewal** — active contributors auto-renew. Dormant ones surface in a `vouch stale` report.

This isn't just "delete inactive users." It's the same drift detection loop: detect staleness, surface it, let humans decide. The automation handles the boring part (scanning); the judgment stays with maintainers.

## The deeper pattern: sorted flat files are underrated

Both vouch and beads chose the same storage format independently: sorted flat files in git. Vouch uses `.td` (one handle per line, alphabetically sorted). Beads uses `.jsonl` (one issue per line, sorted by ID).

This isn't a coincidence. Sorted flat files have three properties that make them ideal for collaborative git workflows:

1. **Deterministic output** — the same data always produces the same file, so diffs are meaningful.
2. **Merge-friendly** — additions at different positions in the sort order don't conflict.
3. **No dependencies** — parseable with `grep`, `awk`, `sort`. No database. No runtime.

The concurrency fix works *because* the format is sorted. Two people adding different users create changes at different line positions. Git rebase handles this automatically. A JSON object or YAML list would conflict on the closing bracket.

## Filtering ideas: not everything deserves a PR

Reading vouch's issue tracker, I saw four potential contributions. But running them through a survival scorecard (will this matter in a year?) killed two of them:

**PR-worthy (pattern transfers cleanly):**

| Beads concept | Vouch application | Issue | Why it works |
|---|---|---|---|
| `bd sync` retry loop | Push resilience in Actions | [#24](https://github.com/mitchellh/vouch/issues/24) | Pure plumbing, 8 lines, zero friction, tagged `help wanted` |
| `last_scanned_at` staleness | Trust decay / expiration | [#21](https://github.com/mitchellh/vouch/issues/21) | Human judgment on renewal is the moat — automation only surfaces the question |

**Discussion-only (pattern doesn't survive transfer):**

| Beads concept | Vouch application | Issue | Why it fails |
|---|---|---|---|
| Content-hashed IDs | Username change resilience | [#20](https://github.com/mitchellh/vouch/issues/20) | Requires breaking `.td` format change for a niche attack vector. GitHub should fix this at the platform level. |
| Multi-repo federation | Web of trust coordination | [#4](https://github.com/mitchellh/vouch/issues/4) | Vouch has ~5 adopters. Federation needs ecosystem scale. Building infrastructure for 50 projects when 5 exist is premature. |

The scorecard saved me from submitting two PRs that would've been politely declined. The git push fix is infrastructure plumbing — it survives because an AI won't replace a retry loop. Trust decay survives because "should this dormant contributor stay trusted?" is irreducibly human judgment. The other two are solutions looking for problems that don't exist at vouch's current scale.

## The meta-lesson

The best contributions to open source projects come from solving the *same problem* in a *different context*. I didn't set out to contribute to vouch. I was reading Hacker News, recognized patterns from my own project, and realized some solutions transfer directly — and some don't.

Cross-pollination isn't "find pattern in project A, copy to project B." It's "find pattern in project A, check if project B has the same failure mode at the same scale." The git push retry works because both projects commit to sorted flat files in concurrent workflows. The federation idea fails because beads has 10+ repos federating while vouch has 5 total adopters.

If you maintain an open source project, go read the issue trackers of projects in completely different domains that share your architectural choices. You'll find solutions to problems you haven't hit yet. But run them through a filter first — the best open source contributions are the ones where the maintainer thinks "obviously, yes" not "interesting, but not now."

---

*The fix for vouch #24 is at [anupamchugh/vouch@fix/git-push-resilience](https://github.com/anupamchugh/vouch/tree/fix/git-push-resilience). Issue [#34](https://github.com/mitchellh/vouch/issues/34) opened for vouching.*
