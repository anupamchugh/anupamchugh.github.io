# Private blog MCP setup

The public reader needs no credential. The private admin MCP is run locally by
the owner with runtime-only environment variables:

```sh
export BLOG_ADMIN_GITHUB_TOKEN='fine-grained-token-for-one-repository'
export BLOG_ADMIN_APPROVAL_SECRET='local-secret-kept-out-of-git'
```

The GitHub token must be limited to `anupamchugh/anupamchugh.github.io`. The
admin gateway still enforces the path and branch policy locally. Do not put the
token in `.mcp.json`, shell history, a blog file, or a commit.

Publication is only proven by owner-approved PR, merge, successful Pages
deployment, and a fresh live URL check. A local response, commit, branch, PR,
or passing check is not publication evidence.
