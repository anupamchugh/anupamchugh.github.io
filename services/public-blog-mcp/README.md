# Public Personal Blog MCP

Credential-free, read-only MCP reader for `anupamchugh.github.io`. It reads
only the blog's public `llms.txt`, `rss.xml`, and same-origin public pages.

Run locally with:

```sh
UV_CACHE_DIR=/private/tmp/uv-cache-blog uv run --project services/public-blog-mcp personal-blog-mcp
```

The Streamable HTTP endpoint is exposed by the MCP SDK at `/mcp`. No GitHub
token is accepted or needed. Remote hosting and a custom domain are separate
owner-approved steps.
