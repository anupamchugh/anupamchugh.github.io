# Private Blog Admin MCP

This is the owner-only policy gateway for blog edits. It is intentionally
separate from the public reader. Supply `BLOG_ADMIN_GITHUB_TOKEN` and
`BLOG_ADMIN_APPROVAL_SECRET` at runtime only; neither is committed.

The gateway permits public-content reads and approved writes on topic branches
for `anupamchugh/anupamchugh.github.io`. It refuses `main`, `private-notes`,
other repositories, merges, and repository-management operations before any
GitHub request. It can open draft PRs, never merge them.
