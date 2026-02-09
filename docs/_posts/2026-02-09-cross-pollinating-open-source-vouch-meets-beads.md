---
draft: true
title: "Cross-pollinating open source: what a trust system can learn from an issue tracker"
date: '2026-02-09T09:00:00.000Z'
categories: [open-source]
keywords: [open-source, vouch, beads, shadowbook, trust, drift-detection, git]
slug: /cross-pollinating-open-source-vouch-meets-beads
published: false
---

Mitchell Hashimoto released [vouch](https://github.com/mitchellh/vouch) last week. It's a trust system for open source: maintainers vouch for contributors, and unvouched PRs get auto-closed. The Ghostty project already uses it. The motivation is blunt — AI tools make it trivially easy to generate plausible-looking but low-quality contributions, so the old "trust by default" model is dead.

I've been building [shadowbook](https://github.com/anupamchugh/shadowbook), a layer on top of Steve Yegge's [beads](https://github.com/steveyegge/beads) issue tracker. Beads gives you git-native issue tracking with sorted flat files and sync. Shadowbook adds a different concern entirely: **drift detection and lifecycle management for specs**. It tracks when specs change via SHA-256 hashes, archives stale ones with compact summaries (94% token savings), manages lifecycle states (active → completed → archived), and auto-links specs to issues by title similarity.

Different problem domain from vouch entirely. But reading through vouch's open issues, patterns from both layers — beads' git plumbing and shadowbook's drift/lifecycle system — mapped to real gaps.

## The bug: bare git push in a concurrent world

Vouch's GitHub Actions commit changes to a `VOUCHED.td` file when a maintainer comments "vouch" on an issue. The action does a `git push` at the end. No retry. No pull. No conflict handling.

When two maintainers vouch different contributors within seconds, the second push fails silently. Issue [#24](https://github.com/mitchellh/vouch/issues/24) — tagged `help wanted`.

In beads (the upstream issue tracker), `bd sync` has been handling this exact problem for months. The `.td` format is alphabetically sorted (one username per line), which means concurrent additions for different users merge cleanly via rebase. The fix is a pull-rebase-retry loop:

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

This is the exact problem shadowbook was built to solve — in a different domain. Specs drift from reality as code evolves. Shadowbook's answer: a **drift detection loop**. `bd spec scan` computes SHA-256 hashes and compares against a registry. Changed hash = flagged drift. `last_scanned_at` timestamps track staleness. And when specs are truly dead, **compaction** archives them with a summary — keeping 5% of the tokens while preserving the essential decisions.

Three shadowbook concepts map directly to vouch's trust decay problem:

**1. Drift detection → Trust staleness.** The same `scan → compare → flag` loop. Instead of hashing spec files, check activity dates. No contribution in N months = flagged for review. `vouch stale` becomes the equivalent of `bd list --spec-changed`.

**2. Lifecycle states → Trust lifecycle.** Shadowbook manages specs through `active → completed → archived` with timestamps at each transition. Vouch could track `vouched → stale → expired → archived`. Each state has clear rules: stale = flagged for review, expired = can't submit PRs, archived = audit trail only.

**3. Compaction → Audit trail.** When a vouch expires or is revoked, don't just delete the line. Archive it with reason and date — the way `bd spec compact` preserves a summary when archiving a spec. This gives maintainers an audit trail without the `.td` file growing forever.

The pattern in all three: **detect staleness, surface it, let humans decide.** The automation handles the boring part (scanning, timestamping, archiving); the judgment stays with maintainers. "Should this dormant contributor stay trusted?" is a question no automation should answer.

## Two layers, two kinds of contribution

The beads/shadowbook split reveals something about open source contributions. **Infrastructure fixes** (retry loops, sync resilience) come from the plumbing layer — they're generic and transfer to any project that commits to git. **Domain insights** (drift detection, lifecycle management, compaction) come from the application layer — they transfer only when the receiving project has the same structural problem.

Both vouch and beads chose sorted flat files in git independently. Vouch uses `.td` (one handle per line, alphabetically sorted). Beads uses `.jsonl` (one issue per line, sorted by ID). The concurrency fix works *because* both formats are sorted — additions at different positions don't conflict, and git rebase handles the merge automatically.

But the drift detection insight is deeper. It required building shadowbook's spec registry (a SQLite table with `sha256`, `last_scanned_at`, `lifecycle`, `archived_at` fields) and running it against real projects to learn that "things go stale and nobody notices" is a universal problem. Trust lists go stale the same way specs do. The fix is the same: scan, compare, flag, let humans decide.

## Filtering ideas: not everything deserves a PR

Reading vouch's issue tracker, I saw four potential contributions. But running them through a survival scorecard (will this matter in a year?) killed two of them:

**PR-worthy (pattern transfers cleanly):**

| Source | Concept | Vouch application | Issue | Why it works |
|---|---|---|---|---|
| **Beads** | `bd sync` retry loop | Push resilience in Actions | [#24](https://github.com/mitchellh/vouch/issues/24) | Pure plumbing, 8 lines, zero friction |
| **Shadowbook** | Drift detection + lifecycle + compaction | Trust decay / expiration | [#21](https://github.com/mitchellh/vouch/issues/21) | Human judgment on renewal is the moat |

**Discussion-only (pattern doesn't survive transfer):**

| Source | Concept | Vouch application | Issue | Why it fails |
|---|---|---|---|---|
| **Beads** | Content-hashed IDs | Username change resilience | [#20](https://github.com/mitchellh/vouch/issues/20) | Breaking `.td` format change for a niche attack vector |
| **Shadowbook** | Multi-repo federation | Web of trust coordination | [#4](https://github.com/mitchellh/vouch/issues/4) | Vouch has ~5 adopters — federation needs ecosystem scale |

The scorecard saved me from submitting two PRs that would've been politely declined. The git push fix is infrastructure plumbing — it survives because an AI won't replace a retry loop. Trust decay survives because "should this dormant contributor stay trusted?" is irreducibly human judgment. The other two are solutions looking for problems that don't exist at vouch's current scale.

## The meta-lesson

The best contributions to open source projects come from solving the *same problem* in a *different context*. I didn't set out to contribute to vouch. I was reading Hacker News, recognized patterns from my own project, and realized some solutions transfer directly — and some don't.

Cross-pollination isn't "find pattern in project A, copy to project B." It's "find pattern in project A, check if project B has the same failure mode at the same scale." The git push retry works because both projects commit to sorted flat files in concurrent workflows. The federation idea fails because beads has 10+ repos federating while vouch has 5 total adopters.

If you maintain an open source project, go read the issue trackers of projects in completely different domains that share your architectural choices. You'll find solutions to problems you haven't hit yet. But run them through a filter first — the best open source contributions are the ones where the maintainer thinks "obviously, yes" not "interesting, but not now."

---

*The fix for vouch #24 is at [anupamchugh/vouch@fix/git-push-resilience](https://github.com/anupamchugh/vouch/tree/fix/git-push-resilience). Issue [#34](https://github.com/mitchellh/vouch/issues/34) opened for vouching.*
