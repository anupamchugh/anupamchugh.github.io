import asyncio

import pytest

from personal_blog_mcp.server import mcp


def test_public_tool_surface_is_read_only():
    tools = asyncio.run(mcp.list_tools())
    assert [tool.name for tool in tools] == ["blog_info", "list_posts", "search_posts", "get_post", "list_apps"]


def test_unknown_write_tool_is_not_available():
    with pytest.raises(Exception):
        asyncio.run(mcp.call_tool("publish_post", {}))
