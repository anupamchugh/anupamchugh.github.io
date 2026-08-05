from __future__ import annotations

import hashlib
import hmac
import json
import os

from mcp.server.mcpserver import MCPServer

from .github_api import GitHubAPI
from .policy import BLOG_REPOSITORY, validate_request

mcp = MCPServer("Personal Blog Admin", version="0.1.0")


def _approval(operation: str, path: str, branch: str, content: str, token: str) -> None:
    secret = os.environ.get("BLOG_ADMIN_APPROVAL_SECRET")
    if not secret:
        raise PermissionError("owner approval secret is not configured")
    message = json.dumps({"operation": operation, "path": path, "branch": branch, "content": content}, sort_keys=True)
    expected = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, token):
        raise PermissionError("exact owner approval is required")


def _api() -> GitHubAPI:
    token = os.environ.get("BLOG_ADMIN_GITHUB_TOKEN")
    if not token:
        raise PermissionError("GitHub token is available only at runtime")
    return GitHubAPI(token, BLOG_REPOSITORY)


@mcp.tool()
def validate_target(operation: str, path: str, branch: str) -> dict[str, str]:
    """Validate a proposed blog operation without contacting GitHub."""
    validate_request(operation, BLOG_REPOSITORY, path, branch)
    return {"status": "allowed", "repository": BLOG_REPOSITORY, "path": path, "branch": branch}


@mcp.tool()
def prepare_file(path: str, branch: str, content: str, approval: str) -> dict:
    """Write approved content only to an owner-approved topic branch."""
    validate_request("contents.write", BLOG_REPOSITORY, path, branch)
    _approval("contents.write", path, branch, content, approval)
    return _api().put_file(path, branch, f"Update {path}", content)


@mcp.tool()
def open_draft_pr(branch: str, title: str, body: str, approval: str) -> dict:
    """Open an approved draft PR; merging is deliberately unavailable."""
    validate_request("pulls.create", BLOG_REPOSITORY, "content", branch)
    _approval("pulls.create", "content", branch, title + "\n" + body, approval)
    return _api().create_draft_pr(branch, title, body)


def main() -> None:
    mcp.run(transport="streamable-http", stateless_http=True, json_response=True)
