# personal blog rehaul spec

## goal

Rebuild the personal site around the strongest body of work without turning it into a generic portfolio or letting generated prose replace the author's voice.

The site should feel like a cabinet of experiments: camera tricks, strange apps, tutorial archives, satire, notes, reviews, and a living writing queue.

## non-goals

- Do not make Better Programming the homepage identity.
- Do not make Takeout Tax a front-page anchor.
- Do not make AI workflow tooling the main story.
- Do not let Codex write personal essays, about-page prose, or blog posts.
- Do not publish Medium export content automatically.

## primary navigation

Use a small lowercase nav:

- `writing`
- `work`
- `notes`
- `reviews`
- `apps`
- `about`

`photos` can stay linked from about/footer or remain in nav if the header still has room after mobile testing.

## homepage structure

### 1. identity

Keep this short and manual. The homepage can use placeholder copy while the final line is written by hand.

Design intent: quiet, direct, black-first, content-first.

### 2. camera tricks

This is the strongest front-page shelf.

Feature:

- `VisionCreditScan`
- `BlinkPoseAndSwipeiOSMLKit`
- `iOSVisionFaceQualityLivePhoto`
- `iOS14VisionHandPose`
- `SwiftUICoreMLEmojiHuntGame`
- selected `iowncode` Vision/Core ML demos

Each item should show:

- title
- one-line human description
- source link
- matching article link if imported/published
- status: `repo`, `article`, `archive`, or `demo`

### 3. small strange apps

Feature the apps as app icons, not product-card essays.

Priority:

- Flickpot
- Playlist Hunter
- Find Common Ground
- Flyleaf
- Checkmate Academy if presentable
- ClocktowerTable if presentable

Stockshots stays out of this shelf unless live/polished.

### 4. humor shelf

Make satire visible but bounded. It should read as a shelf, not a rebrand.

Candidates from Medium export:

- `If Apps Were People You Knew`
- `If Programming Languages Had Honest Slogans`
- `What Freelance Clients Say vs. What They Actually Mean`
- `If Apple Starts Making Home Appliances`
- `If Video Conferencing Apps Pitched Themselves to Customers`
- `If Social Media Stories Had A War Of Words`
- `If Netflix Was Your Girlfriend`
- `If TikTok Was Your Boyfriend`
- `If Google’s Doomed Apps Suddenly Woke Up From Their Graves`
- `10 films that clearly influenced ChatGPT`
- `If Programming Publications Wrote Submission Guidelines in Code`

### 5. platform fights

The Medium export has a substantial run of big-tech and privacy essays. Use this as an archive shelf, not the lead story.

Possible label:

- `platform fights`
- `privacy wars`
- `big tech notes`

Best candidates:

- `Big Tech's 2021 Year Recap`
- `Apple vs. Facebook Isn't Just a Matter of Privacy`
- `Facebook Is Gaslighting Users Into Allowing Ad Tracking on iOS 14`
- `Google Joins Apple to Cancel Facebook's Trillion-Dollar Empire Dream`
- `Apple Is Killing Email Read Receipts With a Single Popup`
- `With iOS 15, Apple Gives Us Strong Reasons to Ditch Google Services`
- `Epic Games Baits Apple To Pull Off The Biggest Marketing Campaign In Recent History`
- `How Facebook's SDK Can Bring Apple's iOS Ecosystem Down Without a Single Line of Code`

Recommended placement: `/writing` or `/work` as a named shelf below camera tricks and apps. The homepage can show one link to the shelf, but should not lead with it.

### 6. latest writing

Keep a date-title list. Do not use cards.

## work page

The `/work` page should be a taxonomy, not a portfolio grid.

Sections:

- camera tricks
- apps
- platform fights
- tutorial archive
- humor/satire
- older android/java archive
- experimental repos

Each section should show only selected items and link to deeper archives.

## writing page

The `/posts` page remains a chronological archive.

Add filters later:

- camera
- swiftui
- realitykit
- platform
- satire
- personal
- notes
- reviews

Do not block the rehaul on filters.

## notes

`/notes` stays in the new design.

Purpose:

- quick thoughts
- TILs
- rough technical notes
- private/dev-only notes hidden from production

It should not compete with essays.

## reviews

`/reviews` stays in the new design.

Purpose:

- film reviews
- movie pattern notes
- short cultural observations

This section is part of the human site and should not be buried.

## old design access

The previous design should remain accessible until the new IA is fully validated.

Preferred approach:

- keep a static snapshot under `/legacy/`
- add a footer link: `old site`
- prevent indexing if it creates duplicate SEO pages

Fallback:

- keep the old design available only as a tagged git release and document how to restore it.

Recommended: static `/legacy/` snapshot if cheap, because it reduces anxiety while the rehaul settles.

## medium export handling

Artifacts created:

- `docs/plans/2026-05-06-medium-export-all-posts.tsv`
- `docs/plans/2026-05-06-medium-export-review.md`

Policy:

- import article candidates into a review queue first
- backdate selected posts to original Medium dates
- keep replies/comments out of public post lists
- preserve original source URL where extractable
- convert to Markdown only after a post is selected for republishing
- keep a non-public repo vault for imported originals so the blog repo is the trusted home without making every item live

Priority import queue:

1. camera tricks / Vision / Core ML posts
2. RealityKit / ARKit posts
3. selected humor/satire posts
4. selected privacy/big-tech essays
5. writing-on-Medium pieces only if they support a manually written retrospective

Visibility model:

- `vault`: stored in the repo, never routed
- `review`: readable locally, not published
- `draft`: local preview, filtered from production
- `published`: public and indexed
- `unlisted`: direct URL only, not shown in indexes

Current status audit:

- `docs/plans/2026-05-06-platform-post-status.md`

## flyleaf role

Flyleaf should support this workflow without writing for the author.

Useful Flyleaf features:

- import Medium export as an archive workspace
- mark items as `ignore`, `review`, `rewrite`, `publish`
- preserve source HTML path and original date
- convert one selected article to Markdown on demand
- show metadata gaps
- write back selected Markdown files to the blog repo

Not allowed:

- auto-rewrite personal posts
- bulk-publish Medium export
- generate author voice

## implementation phases

### phase 1: information architecture

- stabilize nav
- keep notes and reviews
- add `/work`
- add `/humor`
- add `/legacy` if snapshot is available
- ensure homepage has camera tricks and app icons

### phase 2: medium import queue

- build importer from `posts/*.html` to review metadata
- select camera/reality/humor posts
- convert selected posts to Markdown
- backdate with original dates
- add source metadata

### phase 3: visual polish

- verify dark mode
- verify app icons
- verify mobile nav
- avoid nested cards and heavy portfolio styling

### phase 4: publish

- run `npm run build`
- run case-style check
- inspect live routes after deploy:
  - `/`
  - `/work/`
  - `/apps/`
  - `/notes/`
  - `/reviews/`
  - `/humor/`
  - `/legacy/`

## open decisions

- final homepage identity line must be written manually by Anupam
- whether `/photos` stays in primary nav
- whether old design is a static `/legacy` route or only a git tag
- which Medium posts get imported first
