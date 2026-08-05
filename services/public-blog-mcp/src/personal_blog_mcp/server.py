from __future__ import annotations

import asyncio
import os
import time
import uuid
from datetime import datetime, timezone
from typing import Any

import httpx
from mcp.server.mcpserver import MCPServer

from .sources import ORIGIN, canonical_public_url, parse_apps, parse_llms, parse_rss

DISCOVERY = {
    "llms": f"{ORIGIN}/llms.txt",
    "llms_full": f"{ORIGIN}/llms-full.txt",
    "rss": f"{ORIGIN}/rss.xml",
    "sitemap": f"{ORIGIN}/sitemap.xml",
}
MAX_BODY = 1_000_000
MAX_RESULTS = 50

mcp = MCPServer("Personal Blog Reader", version="0.1.0")


async def _fetch(url: str) -> tuple[str | None, str | None]:
    if canonical_public_url(url) is None and url not in DISCOVERY.values():
        return None, "url is outside the public blog origin"
    async with httpx.AsyncClient(timeout=8, follow_redirects=False) as client:
        response = await client.get(url, headers={"User-Agent": "personal-blog-mcp/0.1"})
    if response.is_redirect:
        location = response.headers.get("location", "")
        if canonical_public_url(location) is None:
            return None, "redirect left the public blog origin"
        return await _fetch(location)
    if response.status_code >= 400:
        return None, f"public source returned HTTP {response.status_code}"
    if len(response.content) > MAX_BODY:
        return None, "public source exceeded response limit"
    return response.text, None


async def _records() -> tuple[list[dict[str, str]], list[dict[str, str]], list[str]]:
    warnings: list[str] = []
    posts: list[dict[str, str]] = []
    apps: list[dict[str, str]] = []
    llms, error = await _fetch(DISCOVERY["llms"])
    if llms:
        posts = parse_llms(llms)
        apps = parse_apps(llms)
    elif error:
        warnings.append(f"llms: {error}")
    rss, error = await _fetch(DISCOVERY["rss"])
    if rss:
        known = {record["url"] for record in posts}
        posts.extend(record for record in parse_rss(rss) if record["url"] not in known)
    elif error:
        warnings.append(f"rss: {error}")
    return posts, apps, warnings


def _envelope(data: Any, warnings: list[str], truncated: bool = False) -> dict[str, Any]:
    return {
        "data": data,
        "source_urls": list(DISCOVERY.values()),
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "coverage": "partial" if warnings else "complete",
        "truncated": truncated,
        "unknowns": warnings,
    }


@mcp.tool()
async def blog_info() -> dict[str, Any]:
    """Return public blog identity and discovery URLs."""
    return _envelope({"name": "Anupam Chugh's personal blog", "origin": ORIGIN, "read_only": True}, [])


@mcp.tool()
async def list_posts(limit: int = 20, cursor: int = 0) -> dict[str, Any]:
    """List bounded published post metadata."""
    limit = max(1, min(limit, MAX_RESULTS))
    cursor = max(0, cursor)
    posts, _, warnings = await _records()
    page = posts[cursor : cursor + limit]
    return _envelope({"items": page, "next_cursor": cursor + limit if cursor + limit < len(posts) else None}, warnings, cursor + limit < len(posts))


@mcp.tool()
async def search_posts(query: str, limit: int = 20) -> dict[str, Any]:
    """Search public title, summary, and keyword text."""
    query = query.strip().lower()[:200]
    limit = max(1, min(limit, MAX_RESULTS))
    posts, _, warnings = await _records()
    matches = [post for post in posts if query in " ".join(post.values()).lower()][:limit]
    return _envelope({"items": matches}, warnings, len(matches) == limit)


@mcp.tool()
async def get_post(url: str) -> dict[str, Any]:
    """Read one canonical same-origin public post."""
    canonical = canonical_public_url(url)
    if canonical is None:
        return _envelope(None, ["url is outside the public blog origin"])
    body, error = await _fetch(canonical)
    return _envelope({"url": canonical, "body": body} if body else None, [error] if error else [])


@mcp.tool()
async def list_apps(limit: int = 20, cursor: int = 0) -> dict[str, Any]:
    """List public applications discoverable from the blog index."""
    limit = max(1, min(limit, MAX_RESULTS))
    cursor = max(0, cursor)
    _, apps, warnings = await _records()
    page = apps[cursor : cursor + limit]
    return _envelope({"items": page, "next_cursor": cursor + limit if cursor + limit < len(apps) else None}, warnings, cursor + limit < len(apps))


def main() -> None:
    mcp.run(transport="streamable-http", stateless_http=True, json_response=True, max_request_body_size=MAX_BODY)
