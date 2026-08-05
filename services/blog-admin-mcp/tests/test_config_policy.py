from pathlib import Path


def test_setup_does_not_commit_credentials():
    root = Path(__file__).parents[3]
    for path in [root / "docs/personal-blog-mcp-private-setup.md", root / ".mcp.json"]:
        if path.exists():
            text = path.read_text()
            assert "ghp_" not in text
            assert "github_pat_" not in text
