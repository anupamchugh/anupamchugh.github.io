from __future__ import annotations

BLOG_REPOSITORY = "anupamchugh/anupamchugh.github.io"
ALLOWED_OPERATIONS = {"contents.read", "contents.write", "pulls.read", "pulls.create"}


class PolicyError(ValueError):
    """Raised before any GitHub request when an operation is outside policy."""


def validate_request(operation: str, repository: str, path: str, branch: str) -> None:
    if operation not in ALLOWED_OPERATIONS:
        raise PolicyError("operation is not allowed")
    if repository != BLOG_REPOSITORY:
        raise PolicyError("repository is not allowed")
    if path == "private-notes" or path.startswith("private-notes/"):
        raise PolicyError("private-notes is not part of the blog workflow")
    if operation == "contents.write" and branch == "main":
        raise PolicyError("writes require a topic branch")
    if not branch or branch.startswith("-"):
        raise PolicyError("invalid branch")
