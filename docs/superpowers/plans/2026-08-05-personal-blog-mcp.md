# Personal Blog MCP Implementation Plan

**Goal:** Deliver a credential-free public reader for published blog material and a private owner-only admin MCP that can prepare branch/PR changes while enforcing repository, path, and branch boundaries.

**Architecture:** A small Python public MCP service reads fixed-origin discovery documents and exposes bounded read-only tools. A separate local Python admin MCP owns the policy boundary and calls GitHub's API only after validating repository, branch, path, and explicit approval inputs. GitHub Pages remains static hosting; remote MCP hosting is a separate gate.

**Tech Stack:** Python, official MCP Python SDK, `httpx`, RSS/XML parsing, GitHub REST API, `pytest`, `uv`, Streamable HTTP.

**Execution:** Work in `/private/tmp/anupam-blog-mcp-20260805` on `feat/personal-blog-mcp`; keep the protected main checkout untouched. Use test-first changes, focused receipts, then push the feature branch for review.

## Global Constraints

- Public service has no GitHub credential, filesystem access, shell access, arbitrary URL fetch, or write tool.
- Both services are stateless over Streamable HTTP; no post body is logged.
- Private writes are limited to `anupamchugh/anupamchugh.github.io`, non-`main` topic branches, and approved public content paths; `private-notes` is denied.
- No merge, direct publish, deployment trigger, force-push, repository-setting, secret, deletion, issue, discussion, or social operation.
- A branch, commit, open PR, or passing check is not publication proof.

## Task 1: Establish the public MCP package and protocol contract

**Ownership**
- Create: `services/public-blog-mcp/pyproject.toml`, `services/public-blog-mcp/src/personal_blog_mcp/server.py`, `services/public-blog-mcp/tests/test_protocol.py`
- Modify: none
- Must not change: Next.js app, content, private notes, or deployment configuration

**Interfaces**
- Consumes: MCP Streamable HTTP requests
- Produces: `blog_info`, `list_posts`, `search_posts`, `get_post`, and `list_apps` tool declarations with read-only annotations

**Acceptance**
- The service starts locally without a credential environment variable.
- `tools/list` exposes only the five approved public tools.
- An unknown/write tool is rejected by the MCP protocol.
- SDK version and protocol compatibility are recorded in the package lock/receipt after a bounded `mcp-explorer` discovery canary.

**Verification**
- Red: `uv run pytest services/public-blog-mcp/tests/test_protocol.py` -> import or missing-tool failure
- Green: same command -> protocol contract passes
- Regression: `uv run pytest services/public-blog-mcp/tests` -> pass
- Evidence: `mcp-explorer doctor`, `list`, and `inspect` output saved under `/tmp` or the review receipt

**Dependencies**
- None

## Task 2: Implement fixed-origin public discovery and typed results

**Ownership**
- Create: `services/public-blog-mcp/src/personal_blog_mcp/models.py`, `services/public-blog-mcp/src/personal_blog_mcp/sources.py`, `services/public-blog-mcp/tests/test_sources.py`
- Modify: `services/public-blog-mcp/src/personal_blog_mcp/server.py`
- Must not change: repository access or private-notes

**Interfaces**
- Consumes: the five fixed `anupamchugh.github.io` discovery surfaces
- Produces: bounded typed records containing source URLs, collection time, coverage, truncation, and unknowns

**Acceptance**
- RSS/LLMS/sitemap data is parsed into stable post and app records.
- Canonical URL validation accepts only the blog origin and rejects off-origin URLs before network access.
- Redirects leaving the origin, malformed documents, oversized responses, and timeouts return typed partial results rather than leaking arbitrary content.
- Pagination, query length, result count, concurrency, and request duration are bounded.

**Verification**
- Red: `uv run pytest services/public-blog-mcp/tests/test_sources.py` -> missing parser/validation behavior
- Green: same command -> parser, limits, redirect, and SSRF cases pass
- Regression: `uv run pytest services/public-blog-mcp/tests` -> pass
- Evidence: fixture-only tests prove no network call is made for rejected URLs

**Dependencies**
- Task 1

## Task 3: Wire public tools and local container runtime

**Ownership**
- Create: `services/public-blog-mcp/Dockerfile`, `services/public-blog-mcp/README.md`, `services/public-blog-mcp/tests/test_tools.py`
- Modify: `services/public-blog-mcp/src/personal_blog_mcp/server.py`, `services/public-blog-mcp/pyproject.toml`
- Must not change: static blog hosting or public content

**Interfaces**
- Consumes: typed source layer from Task 2
- Produces: complete public tool calls over local Streamable HTTP and a non-root container image

**Acceptance**
- Every approved tool returns bounded, source-attributed output.
- `get_post` accepts only canonical same-origin post URLs.
- Logs contain request ID, timing, tool, and status but not full post bodies.
- The image has no GitHub token and exposes only the MCP endpoint and an optional health check.

**Verification**
- Red: `uv run pytest services/public-blog-mcp/tests/test_tools.py` -> missing tool behavior
- Green: same command -> all tool contract cases pass
- Regression: `uv run pytest services/public-blog-mcp/tests && docker build services/public-blog-mcp` -> pass
- Evidence: local `mcp-explorer call` for each tool with bounded output

**Dependencies**
- Task 2

## Task 4: Build the private policy-enforcing GitHub admin MCP

**Ownership**
- Create: `services/blog-admin-mcp/pyproject.toml`, `services/blog-admin-mcp/src/blog_admin_mcp/policy.py`, `services/blog-admin-mcp/src/blog_admin_mcp/github_api.py`, `services/blog-admin-mcp/src/blog_admin_mcp/server.py`, `services/blog-admin-mcp/tests/test_policy.py`, `services/blog-admin-mcp/README.md`
- Modify: none
- Must not change: public service or GitHub repository settings

**Interfaces**
- Consumes: owner-authenticated MCP calls and a GitHub token supplied only at runtime
- Produces: read tools plus branch/file/PR preparation tools that are refused before any GitHub request when policy fails

**Acceptance**
- Repository is exact-match restricted to `anupamchugh/anupamchugh.github.io`.
- `main`, `private-notes/**`, other repositories, merge, force-push, settings, secrets, deletion, issue, discussion, release, and social operations are refused locally.
- File writes require a non-`main` topic branch and explicit approval token bound to the exact proposed path/content/diff summary.
- PR creation requires the same approval and creates a draft PR only; merge is not implemented.
- Tokens are read from process credentials and never serialized, logged, or committed.

**Verification**
- Red: `uv run pytest services/blog-admin-mcp/tests/test_policy.py` -> policy module missing
- Green: same command -> direct-main, private-notes, wrong-repo, and unapproved-write cases pass
- Regression: `uv run pytest services/blog-admin-mcp/tests` -> pass
- Evidence: mocked GitHub transport proves rejected requests make zero outbound calls; approved sandbox branch produces an exact diff and draft PR request

**Dependencies**
- Task 1

## Task 5: Document private setup and publication evidence gates

**Ownership**
- Create: `docs/personal-blog-mcp-private-setup.md`, `docs/personal-blog-mcp-operations.md`, `services/blog-admin-mcp/tests/test_config_policy.py`
- Modify: `.mcp.json` only if the current host's official GitHub MCP endpoint and OAuth/token substitution are verified
- Must not change: tokens, secrets, GitHub settings, or deployment

**Interfaces**
- Consumes: local admin MCP and optional official GitHub MCP read-only client
- Produces: owner setup instructions and evidence checklist distinguishing local, branch, PR, deployed, and live states

**Acceptance**
- Setup explains runtime-only credentials and the exact repository/path/branch boundary.
- Configuration tests prove no credential literal is committed.
- Official GitHub MCP is documented as an optional read-only companion; the policy wrapper remains the only private write surface.
- Remote hosting, custom domain, and Pages publication are explicitly owner-approved follow-up gates.

**Verification**
- Red: `uv run pytest services/blog-admin-mcp/tests/test_config_policy.py` -> missing documentation/config guard
- Green: same command -> pass
- Regression: `git diff --check && uv run pytest services/public-blog-mcp/tests services/blog-admin-mcp/tests` -> pass
- Evidence: branch contains this plan, test output, and no secret material

**Dependencies**
- Tasks 3 and 4
