from __future__ import annotations

import httpx


class GitHubAPI:
    def __init__(self, token: str, repository: str):
        self.repository = repository
        self.client = httpx.Client(
            base_url="https://api.github.com",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
            timeout=10,
        )

    def create_branch(self, branch: str, sha: str) -> dict:
        response = self.client.post(f"/repos/{self.repository}/git/refs", json={"ref": f"refs/heads/{branch}", "sha": sha})
        response.raise_for_status()
        return response.json()

    def put_file(self, path: str, branch: str, message: str, content: str, sha: str | None = None) -> dict:
        import base64
        payload = {"message": message, "content": base64.b64encode(content.encode()).decode(), "branch": branch}
        if sha:
            payload["sha"] = sha
        response = self.client.put(f"/repos/{self.repository}/contents/{path}", json=payload)
        response.raise_for_status()
        return response.json()

    def create_draft_pr(self, head: str, title: str, body: str) -> dict:
        response = self.client.post(f"/repos/{self.repository}/pulls", json={"title": title, "body": body, "head": head, "base": "main", "draft": True})
        response.raise_for_status()
        return response.json()
