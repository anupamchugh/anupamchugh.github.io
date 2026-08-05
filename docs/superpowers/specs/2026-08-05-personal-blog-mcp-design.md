# Personal Blog MCP Design

**Status:** owner-approved direction; implementation requires review of this written specification

## Goal

Provide two deliberately separate ways for MCP clients to work with Anupam's
blog:

1. a public, credential-free, read-only MCP for published blog material; and
2. a private owner workflow using GitHub's official MCP to read the repository,
   prepare changes on a branch, and open a pull request.

Threadmark is explicitly out of scope for this slice.

## Product Boundary

The public server is a publication reader, not an identity oracle, web crawler,
or communication agent. The private workflow is a draft-and-review tool, not an
autonomous publisher.

Neither path may post to social networks, contact another person, merge a pull
request, push directly to `main`, change repository settings, read private notes,
or trigger a deployment intentionally.

## Public Read-Only MCP

### Source

The server reads only already-public discovery surfaces:

- `https://anupamchugh.github.io/llms.txt`
- `https://anupamchugh.github.io/llms-full.txt`
- `https://anupamchugh.github.io/rss.xml`
- `https://anupamchugh.github.io/sitemap.xml`
- public post and app URLs on the same origin

It receives no GitHub token and cannot access the private repository,
`private-notes`, drafts, local files, or arbitrary caller-supplied URLs.

### Tools

- `blog_info()` returns the public identity description and discovery URLs.
- `list_posts(limit, cursor)` returns bounded published-post metadata.
- `search_posts(query, limit)` searches titles, summaries, categories, and
  keywords from the public index.
- `get_post(url)` accepts only canonical public post URLs on the blog origin.
- `list_apps(limit, cursor)` returns public app records.

Every result includes source URLs, collected-at time, coverage, truncation, and
unknowns. Tool annotations declare read-only, non-destructive, and idempotent
behavior.

### Transport and Hosting

The service uses stateless MCP over HTTPS. GitHub Pages continues to host the
static blog and cannot host the executable endpoint. Initial local testing uses
`http://127.0.0.1`; remote deployment is a separate owner-approved step on a
container host or VPS. A custom domain is optional.

### Security

- allow only `GET` requests made by the server to the fixed blog origin;
- reject redirects leaving that origin;
- cap request body, response body, concurrency, and per-tool duration;
- validate MCP protocol and HTTP Origin headers;
- apply public rate limits;
- log timing, tool name, status, and request ID without full post bodies;
- include no shell, filesystem, arbitrary fetch, write, or credential tools.

## Private Owner GitHub MCP

### Provider

Use GitHub's official MCP server. Authentication is owner-only using OAuth or a
fine-grained token restricted to `anupamchugh/anupamchugh.github.io`. No token is
stored in the repository or committed configuration.

### Allowed Operations

- read repository files outside `private-notes`;
- search public post and application source;
- create a new topic branch from current `main`;
- create or update a draft or post on that topic branch;
- read the resulting diff and pull-request checks;
- open a pull request only after the owner approves its exact title, body, and
  diff.

### Prohibited Operations

- direct writes to `main`;
- merge, auto-merge, force-push, release, repository-setting, secret, deletion,
  issue, discussion, or social tools;
- reading or changing `private-notes` through the normal blog workflow;
- treating a commit, pushed branch, open PR, or passing check as published.

Publishing evidence requires all of: owner-approved pull request, merge to
`main`, successful GitHub Pages deployment, and a fresh live URL check.

## User Flows

### Public Read

```text
MCP client -> public blog MCP -> fixed public discovery files -> bounded result
```

### Private Write

```text
owner request
  -> GitHub MCP reads current main
  -> prepares exact content and diff
  -> owner approves
  -> topic branch and PR
  -> owner reviews and merges outside the MCP workflow
  -> Pages deploys
  -> fresh live check proves publication
```

## Failure Handling

- A missing or malformed discovery surface returns a typed partial result.
- A timeout preserves completed items and reports incomplete coverage.
- An off-origin URL is rejected before network access.
- A public request for a write tool returns tool-not-found.
- A private request targeting `main`, another repository, or `private-notes` is
  refused before invoking GitHub.
- Missing owner approval stops before branch, PR, or other external mutation.

## Verification

### Public Server

- unit tests for RSS/LLMS parsing, canonical URLs, pagination, and output limits;
- SSRF and redirect tests;
- MCP `server/discover`, `tools/list`, and each tool-call contract;
- `mcp-explorer doctor`, `list`, `inspect`, and bounded `call` canaries;
- assertion that no environment credential is required or read.

### Private Workflow

- configuration exposes only the selected GitHub repository and tools;
- read-only test succeeds before enabling branch/PR tools;
- attempted direct-main, merge, deletion, other-repository, and `private-notes`
  operations are rejected;
- a sandbox topic branch can produce an exact diff and draft PR without merging;
- live publication is never claimed before a successful deploy and URL check.

## Delivery Slices

1. Implement and locally test the credential-free public reader.
2. Configure and verify private GitHub MCP read-only access.
3. Enable the minimal branch/file/PR tool set and prove the approval gate.
4. Obtain separate owner approval for remote hosting and any domain or cost.

## Acceptance

- Public clients can query published posts and apps without gaining write or
  arbitrary-web access.
- The public process contains no repository credential.
- The owner can prepare a blog change through GitHub MCP only on a topic branch
  and can open a PR after exact approval.
- Neither MCP can merge or directly publish.
- Tests and receipts distinguish local, branch, PR, deployed, and live state.
