from personal_blog_mcp.sources import canonical_public_url, parse_apps, parse_rss, parse_llms


def test_rejects_off_origin_before_fetch():
    assert canonical_public_url("https://evil.example/post") is None
    assert canonical_public_url("https://anupamchugh.github.io/post/") == "https://anupamchugh.github.io/post/"


def test_parses_rss_and_llms_records():
    rss = """<rss><channel><item><title>Hello</title><link>https://anupamchugh.github.io/hello/</link><description>World</description></item></channel></rss>"""
    llms = "# Blog\n\n- [Hello](https://anupamchugh.github.io/hello/): World\n"
    assert parse_rss(rss)[0]["title"] == "Hello"
    assert parse_llms(llms)[0]["url"].endswith("/hello/")


def test_parses_apps_section():
    document = "## Apps\n\n- [Match Box](https://anupamchugh.github.io/match-box/): building\n\n## Recent writing"
    assert parse_apps(document)[0]["title"] == "Match Box"
