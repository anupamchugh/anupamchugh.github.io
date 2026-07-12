# Shadowbook F1 Rewrite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the Shadowbook F1 blog draft to be HN‑style and Elements‑of‑Style clear, while staying system‑agnostic.

**Architecture:** Keep the F1 metaphor, tighten prose, and increase information density. Use short, declarative sentences, specific nouns, and strong verbs. Lead with a high‑signal hook; end with a crisp takeaway.

**Tech Stack:** Markdown (Jekyll post in `docs/_posts/`).

---

### Task 1: Baseline review and structure map

**Files:**
- Modify: `docs/_posts/2026-02-04-shadowbook-f1-control-room.md`

**Step 1: Read the current draft and outline sections**

- Extract the section list and identify redundant or weak sections.

**Step 2: Decide the new outline**

- Keep: Track, Cars, Pit Wall, Telemetry, Drift, Collision, Strategy Loop, Safety, Radio, Edge, Next Laps.
- Tighten: Merge overlapping bullets; drop repetitious phrasing.

**Step 3: Commit outline changes to notes in the same file (temporary)**

- Add a short inline TODO marker for each section that needs heavy rewrite.

### Task 2: Rewrite for HN density and Elements of Style

**Files:**
- Modify: `docs/_posts/2026-02-04-shadowbook-f1-control-room.md`

**Step 1: Rewrite the hook and first two paragraphs**

- Remove soft lead‑ins; lead with the claim.
- Keep sentences short and active.

**Step 2: Rewrite each section with one topic sentence**

- Topic sentence first, concrete details next.
- Replace generic words with specific ones.

**Step 3: Cut 20–30% of words**

- Remove repeated metaphors and filler.

**Step 4: Add one tight “system map” paragraph**

- A concise paragraph that explains Shadowbook’s moving parts without domain specifics.

### Task 3: Final polish pass

**Files:**
- Modify: `docs/_posts/2026-02-04-shadowbook-f1-control-room.md`

**Step 1: Ensure consistent tense and parallel structure**

- Normalize verb tense, fix list parallelism.

**Step 2: Place emphatic words at sentence ends**

- End key sentences with the punch word.

**Step 3: Remove TODO markers**

- Ensure draft is clean and ready.

### Task 4: Save draft (no publish)

**Files:**
- Modify: `docs/_posts/2026-02-04-shadowbook-f1-control-room.md`

**Step 1: Confirm frontmatter remains `draft: true`**

**Step 2: Optional commit**

```bash
git add docs/_posts/2026-02-04-shadowbook-f1-control-room.md
git commit -m "draft: tighten F1 Shadowbook post"
```

---

Plan complete and saved to `docs/plans/2026-02-04-shadowbook-f1-rewrite.md`. Two execution options:

1. Subagent-Driven (this session)
2. Parallel Session (separate)

Which approach?
