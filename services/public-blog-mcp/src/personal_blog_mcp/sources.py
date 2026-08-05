from __future__ import annotations

from urllib.parse import urlparse, urlunparse
from xml.etree import ElementTree

ORIGIN = "https://anupamchugh.github.io"


def canonical_public_url(value: str) -> str | None:
    parsed = urlparse(value)
    if parsed.scheme != "https" or parsed.netloc != "anupamchugh.github.io":
        return None
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        return None
    path = parsed.path or "/"
    if not path.startswith("/"):
        return None
    return urlunparse(("https", parsed.netloc, path, "", "", ""))


def parse_rss(document: str) -> list[dict[str, str]]:
    root = ElementTree.fromstring(document)
    records: list[dict[str, str]] = []
    for item in root.findall(".//item"):
        title = (item.findtext("title") or "").strip()
        url = canonical_public_url((item.findtext("link") or "").strip())
        if title and url:
            records.append({"title": title, "url": url, "summary": (item.findtext("description") or "").strip()})
    return records


def parse_llms(document: str) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    for line in document.splitlines():
        line = line.strip()
        if not line.startswith("- [") or "](" not in line:
            continue
        title, rest = line[3:].split("](", 1)
        raw_url, _, summary = rest.partition("):")
        url = canonical_public_url(raw_url)
        if title and url:
            records.append({"title": title.strip(), "url": url, "summary": summary.strip()})
    return records


def parse_apps(document: str) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    in_apps = False
    for line in document.splitlines():
        stripped = line.strip()
        if stripped == "## Apps":
            in_apps = True
            continue
        if in_apps and stripped.startswith("## "):
            break
        if not in_apps or not stripped.startswith("- [") or "](" not in stripped:
            continue
        title, rest = stripped[3:].split("](", 1)
        raw_url, _, summary = rest.partition("):")
        if title and raw_url.startswith(("https://", "http://")):
            records.append({"title": title.strip(), "url": raw_url.strip(), "summary": summary.strip()})
    return records
