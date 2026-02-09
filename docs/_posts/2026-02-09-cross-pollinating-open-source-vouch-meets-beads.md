---
title: "Cross-pollinating open source: what a trust system can learn from an issue tracker"
date: '2026-02-09T09:00:00.000Z'
categories: [open-source]
keywords: [open-source, vouch, beads, shadowbook, trust, drift-detection, git]
slug: /cross-pollinating-open-source-vouch-meets-beads
type: note
published: true
---

Mitchell Hashimoto's [vouch](https://github.com/mitchellh/vouch) is a trust system for open source: maintainers vouch for contributors, unvouched PRs get auto-closed. Built for Ghostty to combat AI-generated slop contributions.

I build [shadowbook](https://github.com/anupamchugh/shadowbook), a layer on [beads](https://github.com/steveyegge/beads) that adds drift detection and lifecycle management for specs. Different domain. Same structural problems.

**The bug I fixed:** vouch's GitHub Actions do a bare `git push` with no retry. Two concurrent vouches = second push fails silently ([#24](https://github.com/mitchellh/vouch/issues/24), tagged `help wanted`). Beads' `bd sync` handles this with a pull-rebase-retry loop. Eight lines of Nushell, applied to both manage actions. [Fix ready](https://github.com/anupamchugh/vouch/tree/fix/git-push-resilience).

**The design gap:** once vouched, you stay vouched forever ([#21](https://github.com/mitchellh/vouch/issues/21)). No expiration. Shadowbook solves this for specs with drift detection — hash files, compare against registry, flag when stale. Same pattern works for trust: scan activity dates, flag dormant accounts, let humans decide on renewal. The automation surfaces the question; maintainers own the judgment.

**What I filtered out:** I started with four ideas but asked "will this matter to the maintainer in a year?" for each. Two survived (push retry + trust decay). Two died — stable identity via user IDs requires a breaking format change for a niche attack vector, and cross-repo trust federation is premature when vouch has five adopters.

**The lesson:** cross-pollination isn't copying code between projects. It's recognizing that "git push fails under concurrency" and "trust lists go stale" are the same class of problem as "spec hashes drift." Check if the failure mode matches at the same scale. The best open source contributions make the maintainer think "obviously, yes."

---

*[Issue #34](https://github.com/mitchellh/vouch/issues/34) opened for vouching.*
