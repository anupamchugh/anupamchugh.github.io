import pytest

from blog_admin_mcp.policy import PolicyError, validate_request


def test_allows_public_file_on_topic_branch():
    validate_request("contents.write", "anupamchugh/anupamchugh.github.io", "drafts/hello.md", "topic/hello")


@pytest.mark.parametrize(
    "repo,path,branch",
    [
        ("other/repo", "content/hello.md", "topic/hello"),
        ("anupamchugh/anupamchugh.github.io", "content/hello.md", "main"),
        ("anupamchugh/anupamchugh.github.io", "private-notes/secret.md", "topic/hello"),
    ],
)
def test_rejects_unsafe_targets(repo, path, branch):
    with pytest.raises(PolicyError):
        validate_request("contents.write", repo, path, branch)


def test_rejects_unsupported_operation():
    with pytest.raises(PolicyError):
        validate_request("pulls.merge", "anupamchugh/anupamchugh.github.io", "content/hello.md", "topic/hello")
