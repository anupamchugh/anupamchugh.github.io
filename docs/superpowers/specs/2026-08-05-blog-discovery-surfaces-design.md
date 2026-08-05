# Blog Discovery Surfaces Design

## Goal

Make the existing public blog reliably understandable to feed readers, search engines, and evidence tools without rewriting Anupam's prose or publishing private records.

## Scope

- Repair the footer's `/rss.xml` destination with a valid RSS 2.0 feed of public posts.
- Publish `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and `/llms-full.txt` in the static export.
- Add factual JSON-LD for the site owner, public app catalogue, and public post pages.
- Keep app destinations as ordinary server-rendered links in `/apps/`.
- Add automated checks against the exported files and HTML.

## Boundaries

- Do not rewrite post or homepage prose.
- Do not include drafts, private notes, App Store Connect data, or inferred identities.
- Do not change Threadmark or make the blog depend on an MCP server.
- Do not absorb the owner's uncommitted app-catalogue expansion from the primary checkout.
- Do not merge or deploy without owner review; a branch and pull request are the delivery boundary.

## Approach

Next.js metadata routes will produce the crawl-control and sitemap files. Static route handlers will produce RSS and the two plain-text LLM indexes from the repository's existing public content. JSON-LD will be emitted in server-rendered pages from the same `siteConfig`, `apps`, and post records used by the visible site, avoiding a second hand-maintained catalogue.

Export-level tests will inspect `out/`, because the observable contract is the GitHub Pages artifact rather than a component implementation detail. They will verify file presence, canonical URLs, public-only feed entries, ordinary App Store/GitHub anchors, and the expected schema types.

## Acceptance

- `npm run build` creates all five discovery endpoints as static files.
- RSS is parseable XML and includes every public post, excluding drafts and private notes.
- Sitemap contains canonical public routes and public post URLs.
- Robots allows public crawling and names the sitemap.
- Both LLM indexes identify the site, primary sections, public profiles, apps, and writing without claiming private or live runtime data.
- Exported HTML contains `Person`, `ItemList`/`SoftwareApplication`, and `BlogPosting` JSON-LD where appropriate.
- Existing visible copy and navigation remain unchanged.

