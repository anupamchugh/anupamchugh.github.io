# Blog Discovery Surfaces Implementation Plan

**Goal:** Produce a static blog artifact that feed readers, crawlers, and evidence tools can resolve without JavaScript-only inference.

**Architecture:** Use Next.js static metadata/routes backed by existing content modules, then verify the exported artifact with Node's built-in test runner.

**Tech Stack:** Next.js App Router, TypeScript, RSS/XML, JSON-LD, Node test runner

**Execution:** One isolated branch and worktree; tests first; focused artifact checks followed by the complete production build.

## Global Constraints

- Preserve all existing prose and exclude private/draft content.
- Do not change Threadmark or the owner's dirty primary checkout.
- Do not merge or deploy from this task.

## Task 1: Executable static-export contract

**Ownership**
- Create: `tests/discovery-surfaces.test.mjs`
- Modify: `package.json`
- Must not change: application content

**Interfaces**
- Consumes: generated `out/` artifact
- Produces: `npm test` checks for public discovery files and semantic records

**Acceptance**
- Missing RSS, sitemap, robots, LLM indexes, canonical links, or schema records fail with specific messages.

**Verification**
- Red: `npm test` -> fails because discovery files are absent from the current export
- Green: `npm test` -> passes after Tasks 2 and 3
- Regression: `npm run build && npm test` -> pass
- Evidence: command output and exported-file inspection

**Dependencies**
- None

## Task 2: Feeds and crawler indexes

**Ownership**
- Create: `app/robots.ts`, `app/sitemap.ts`, `app/rss.xml/route.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `lib/discovery.ts`
- Modify: none outside those modules
- Must not change: post Markdown and visible page copy

**Interfaces**
- Consumes: `siteConfig`, `apps`, and `getPublicPosts()`
- Produces: RSS 2.0, sitemap XML, robots text, and two public plain-text indexes

**Acceptance**
- Routes export statically, use canonical URLs, escape generated text, and exclude non-public posts.

**Verification**
- Red: Task 1 artifact checks fail on the committed baseline
- Green: `npm run build && npm test` -> route checks pass
- Regression: `npm run build` -> pass
- Evidence: generated files under `out/`

**Dependencies**
- Task 1

## Task 3: Structured identity, apps, and posts

**Ownership**
- Create: `components/json-ld.tsx`
- Modify: `app/layout.tsx`, `app/apps/page.tsx`, `app/posts/[slug]/page.tsx`, `lib/discovery.ts`
- Must not change: visible prose, styling, app destinations, or post bodies

**Interfaces**
- Consumes: existing site, app, and post records
- Produces: server-rendered `Person`, `ItemList`, `SoftwareApplication`, and `BlogPosting` JSON-LD

**Acceptance**
- Schema records are factual, canonical, valid JSON, and ordinary app anchors remain in exported HTML.

**Verification**
- Red: Task 1 schema checks fail on the committed baseline
- Green: `npm run build && npm test` -> all artifact checks pass
- Regression: `npm run build`, `npm test`, and `git diff --check` -> pass
- Evidence: exported homepage, apps page, and one post page

**Dependencies**
- Tasks 1 and 2

## Task 4: Pull-request build protection

**Ownership**
- Create: `.github/workflows/pr-checks.yml`, `tests/pr-workflow.test.mjs`
- Modify: none
- Must not change: deployment workflow, dependency automation, application code, or content

**Interfaces**
- Consumes: pull requests targeting `main`, `package-lock.json`, and existing npm scripts
- Produces: one read-only GitHub check covering install, production build, and artifact tests

**Acceptance**
- The workflow runs on pull requests to `main`, cancels superseded runs, has only `contents: read`, and cannot deploy.

**Verification**
- Red: `node --test tests/pr-workflow.test.mjs` -> fails while the workflow is absent
- Green: `node --test tests/pr-workflow.test.mjs` -> pass
- Regression: `npm run build && npm test` -> pass
- Evidence: successful `PR checks / verify` result on draft PR #1

**Dependencies**
- Tasks 1 through 3
