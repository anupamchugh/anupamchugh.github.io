#!/usr/bin/env python3
"""Builds the client showcase (static HTML, CSS, JS, WebP images, font) into public/showcase/.

Run from anywhere:  python3 -I tools/showcase/build.py            (writes public/showcase/)
                    python3 -I tools/showcase/build.py --out DIR   (writes DIR instead; used to diff against the published page)

Needs cwebp and sips. Inputs, all inside this repo:
  content/apps.json, public/app-icons/   the app list, store names and links, icons
  tools/showcase/src-assets/             origins.json (first commit and commit count) and the Glint captures
  tools/showcase/provenance.json         source and date of every image; the build stops if an image is missing from it
Images marked "frozen" in provenance.json came from files outside this repo; they are kept as published and copied
from public/showcase/img. Every other image is re-encoded from the file the list names, byte for byte the same each run.
"""
import argparse, html, json, pathlib, re, shutil, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
PUBLISHED = ROOT / "public" / "showcase"
ap = argparse.ArgumentParser()
ap.add_argument("--out", default=str(PUBLISHED))
SITE = pathlib.Path(ap.parse_args().out).resolve()
BLOG = ROOT
GLINT_NEW = HERE / "src-assets" / "glint"
ORIGINS = json.load(open(HERE / "src-assets" / "origins.json"))
PROV = json.load(open(HERE / "provenance.json"))["images"]
BUILT = "25 October 2026"
CONTACT = "mailto:anupamchugh@gmail.com?subject=Work%20with%20me"
BLOG_HOME = "https://anupamchugh.github.io"
GITHUB = "https://github.com/anupamchugh"
NAME = "Anupam Chugh"

esc = html.escape

# ---------------------------------------------------------------- lit-glass colour per app (hand-picked from each icon)
COLORS = {
    "rifflet": "#f2b01e", "common-ground": "#6d2fd9", "playlist-hunter": "#19a7b0", "pinprint": "#b9733c",
    "pastport": "#1f6f7a", "feedloom": "#4a35d8", "flickpot": "#2f8f46", "flyleaf": "#12907c", "getnod": "#6b4bd6",
    "best-face-forward": "#1d7a9a", "breakline-surf": "#0a8fa8", "checkmate-academy": "#6a3fd1",
    "clocktower-table": "#3b3f8f", "docpolish": "#1b8cff", "lineage-mirror": "#4f8a6e", "roamproof": "#1f6f55",
    "swell-window": "#1f7fc4", "the-match-room": "#1a7a58",
}
REPO = {  # blog slug -> workspace repo whose history gives the first-commit plate (None = not located)
    "rifflet": "KeyMuse", "common-ground": "PlaceMatch", "playlist-hunter": "MySongs", "pastport": "Pastport",
    "flickpot": None, "flyleaf": "flyleaf", "clocktower-table": "ClocktowerTable", "checkmate-academy": "CheckmateAcademy",
    "feedloom": "Feedloom", "getnod": "nod", "best-face-forward": "FaceFrame", "breakline-surf": "SurfCoach",
    "docpolish": "DocPolish", "lineage-mirror": "LineageMirror", "pinprint": "Pinprint", "roamproof": "RoamProof",
    "swell-window": "Crossing", "the-match-room": "cupcompass-26",
}
DISPLAY = {"common-ground": "Orbits", "playlist-hunter": "EchoHunt"}
MODAL = (HERE / "contact-modal.html").read_text(encoding="utf8")


def lum(hexcolor):
    r, g, b = [int(hexcolor[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def on_color(hexcolor):
    """Pick near-black or white text, whichever contrasts more with the glass."""
    l = lum(hexcolor)
    white, black = 1.05 / (l + 0.05), (l + 0.05) / (lum("#0c0d0f") + 0.05)
    return "#ffffff" if white >= black else "#0c0d0f"


def sentence(s):
    s = s.strip()
    s = re.sub(r"\bi\b", "I", s)
    for pat, rep in (("ios", "iOS"), ("macos", "macOS"), ("os", "OS"), ("ai", "AI"), ("ocr", "OCR"), ("rss", "RSS"),
                     ("github", "GitHub"), ("app store", "App Store"), ("bali", "Bali"), ("indonesia", "Indonesia")):
        s = re.sub(r"\b" + pat + r"\b", rep, s, flags=re.I if pat != "os" else 0)
    s = re.sub(r"(?<=[.!?] )([a-z])", lambda m: m.group(1).upper(), s)
    s = s[:1].upper() + s[1:]
    s = s.replace("An RSS", "An RSS")
    return s


def plate_for(slug, repo):
    v = ORIGINS.get(repo or "", {})
    if not v or not v.get("first"):
        return ""
    date = v["first"].split("|")[0]
    y, m, d = date.split("-")
    mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][int(m) - 1]
    return f"First commit {int(d)} {mon} {y} · {int(v['commits']):,} commits"


# ---------------------------------------------------------------- images
USED = set()


def check_provenance(name):
    e = PROV.get(name)
    if not e:
        sys.exit(f"{name} has no entry in provenance.json: add its source and date before it can be published")
    return e


def webp(name, max_h=1100, quality=82, square=None):
    """Return (name, width, height) for img/<name>. A frozen image is copied from the published folder; any other
    image is encoded from the in-repo file that provenance.json names."""
    e = check_provenance(name)
    out = SITE / "img" / name
    out.parent.mkdir(parents=True, exist_ok=True)
    if e["frozen"]:
        keep = PUBLISHED / "img" / name
        if not keep.exists():
            sys.exit(f"{name} is frozen but {keep} is missing")
        if keep.resolve() != out.resolve():
            shutil.copyfile(keep, out)
    else:
        src = ROOT / e["source"]
        if not src.exists():
            sys.exit(f"{name}: source {e['source']} is missing")
        crop = e.get("crop")  # [x, y, width, height] taken from the source before it is resized
        if square:
            cmd = ["cwebp", "-quiet", "-q", str(quality), "-resize", str(square), str(square), str(src), "-o", str(out)]
        else:
            h = crop[3] if crop else int(re.search(r"pixelHeight: (\d+)", subprocess.run(["sips", "-g", "pixelHeight", str(src)], capture_output=True, text=True).stdout).group(1))
            cmd = (["cwebp", "-quiet", "-q", str(quality)] + (["-crop"] + [str(v) for v in crop] if crop else [])
                   + (["-resize", "0", str(max_h)] if h > max_h else []) + [str(src), "-o", str(out)])
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0 or not out.exists():
            sys.exit(f"cwebp failed for {src}: {r.stderr[:200]}")
    dims = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(out)], capture_output=True, text=True).stdout
    w = int(re.search(r"pixelWidth: (\d+)", dims).group(1))
    hh = int(re.search(r"pixelHeight: (\d+)", dims).group(1))
    USED.add(name)
    return name, w, hh


def img(name_wh, alt, cls="", eager=False):
    name, w, h = name_wh
    load = "" if eager else ' loading="lazy"'
    return f'<img src="img/{name}" width="{w}" height="{h}" alt="{esc(alt)}"{load}>'


def phone(name_wh, alt, eager=False, width=None):
    style = f' style="--w:{width}px"' if width else ""
    return f'<div class="phone"{style}>{img(name_wh, alt, eager=eager)}</div>'


# ---------------------------------------------------------------- content
apps = json.load(open(BLOG / "content/apps.json"))
icons = {}
for a in apps:
    slug = a["slug"]
    icons[slug] = webp(f"icon-{slug}.webp", square=192, quality=88)

S = {
    "orbits1": webp("orbits-plan.webp"),
    "orbits2": webp("orbits-tools.webp"),
    "rifflet1": webp("rifflet-make-dark.webp"),
    "echo1": webp("echohunt-chat.webp"),
    "pin1": webp("pinprint-today.webp", max_h=1000),
    "pin2": webp("pinprint-map.webp", max_h=1000),
    "pin3": webp("pinprint-search.webp", max_h=1000),
    "brk1": webp("breakline-home.webp", max_h=1000),
    "brk2": webp("breakline-pose-overlay.webp", max_h=1000),
    "brk3": webp("breakline-result.webp", max_h=1000),
    "pas1": webp("pastport-home.webp"),
    "pas2": webp("pastport-answer.webp"),
    "feed1": webp("feedloom-comic-library.webp"),
    "feed2": webp("feedloom-newsprint-library.webp"),
    "feed3": webp("feedloom-library.webp"),
    "tm1": webp("threadmark-board.webp"),
    "rp1": webp("preview-orbits-launch.webp"),
    "rp2": webp("preview-quorion-storyteller.webp"),
    "rp3": webp("preview-glint-portfolio.webp"),
}
G = [webp(f"glint-{i}.webp") for i in (1, 2, 3)]
G_WIDE = webp("glint-scorecard.webp", max_h=700)
GL_WELCOME = webp("glint-live-welcome.webp", max_h=1000)
GL_WATCH = webp("glint-live-watchlist.webp", max_h=1000)
GL_ASK = webp("glint-live-ask.webp", max_h=1000)
GL_ASK_ANSWER = webp("glint-ask-answer.webp", max_h=1000)
GL_LINE_UP = webp("glint-line-rising.webp", max_h=1000)
GL_LINE_DOWN = webp("glint-line-falling-dark.webp", max_h=1000)
GL_LINE_SCRUB = webp("glint-line-scrubbing.webp", max_h=1000)
GL_LINE_LIVE = webp("glint-live-line.webp", max_h=1000)
GL_CANDLES = webp("glint-candles-native.webp", max_h=1000)
MORE_IMG = {k: webp(f"{k}.webp", max_h=1000) for k in ("lineage-mirror-pattern", "lineage-mirror-journal", "flickpot-table", "flickpot-how-to-play")}


def shots_from(prefix, rows, max_h=900):
    """Every screen worth showing, per app: (key, caption, alt text) -> {key: (image, alt, caption)}."""
    return {key: (webp(f"{prefix}-{key}.webp", max_h=max_h), alt, cap) for key, cap, alt in rows}


ORB = shots_from("orbits-g", [
    ("plan", "Plan", "Orbits Plan screen asking Where to? with starters for a day out, finding food, meeting someone and a date night"),
    ("saved", "Saved places", "Orbits Saved tab listing three saved places with a search box"),
    ("more", "A place, and more like it", "Orbits place screen for Orbit Taste Cafe with category, taste fields and a More like this list"),
    ("taste", "An answer from saved places", "Orbits answering which saved place is closest to one the person liked, with a row showing what it used"),
    ("tools-on", "Tools for this plan", "Orbits Tools for this plan sheet with saved places, maps search, route and weather all switched on"),
    ("tools-off", "Weather switched off", "Orbits Tools for this plan sheet with weather switched off"),
    ("refused", "It says what it cannot do", "Orbits replying that it could not complete a weather question because that tool is turned off"),
    ("history", "History", "Orbits History tab, empty until a place is approved"),
])
QUO = shots_from("quorion-g", [
    ("hub", "Choose your game", "The Quorion game hub listing a clocktower board, Night of the Ninja and Maskmen"),
    ("seat", "Seat the table", "Dealing screen with seven seats around a circle and a list of players waiting to look at their character"),
    ("reveal", "A private reveal", "A reveal screen for one player with a Hide it button and a hand-the-phone-back button"),
    ("night", "The first night, in order", "First night list with the current step highlighted and an instruction for the host"),
    ("mark", "A step that needs a choice", "First night step that asks the host to tap a seat on the table"),
    ("day", "Day: nominations", "Day 1 screen with an Add a nomination button"),
    ("vote", "Votes and the block", "A nomination with a vote counter and an on the block label"),
    ("night2", "Night two", "Night 2 step list with a Done, next button"),
])
XTH = shots_from("xthlete-g", [
    ("discover", "Discover", "Xthlete concept showing Discover with upcoming sample tournaments"),
    ("event", "An event", "Xthlete concept showing a sample tournament with schedule and entry fee"),
    ("rankings", "Rankings", "Xthlete concept showing sample singles rankings"),
    ("profile", "A player", "Xthlete concept showing a sample athlete profile with rank, matches and recent results"),
]) | shots_from("xthlete-g", [
    ("entry", "A demo entry", "Xthlete concept confirming a demo entry saved on this device, with no payment"),
    ("mine", "My events", "Xthlete concept's My events screen listing one saved demo entry"),
])
MN = shots_from("maskmen-g", [
    ("maskmen", "Maskmen", "Maskmen game table: one player against two bots, with a ring and a hand of cards"),
    ("ninja", "Night of the Ninja", "Night of the Ninja companion with four players listed and their honor"),
])

app_by_slug = {a["slug"]: a for a in apps}


def store_name_note(slug):
    """Where the page's short name and the App Store name differ, say what the store calls the app."""
    a = app_by_slug[slug]
    return f"On the App Store as {a['name']}." if slug in DISPLAY else ""


def fact_plate(slug, extra=""):
    a = app_by_slug[slug]
    plat = " + ".join(a.get("platforms", []))
    ver = a.get("version", "")
    ver = f"v{ver}" if ver and ver != "?" else ""
    parts = [p for p in (plat, ver, plate_for(slug, REPO.get(slug))) if p]
    if extra:
        parts.append(extra)
    return " · ".join(parts)


ARROW_UR = '<svg class="ic" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M4.5 11.5l7-7M6 4.5h5.5V10" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"/></svg>'
ARROW_R = '<svg class="ic" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false"><path d="M3 12h17M14 5.5l6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>'


def store_link(slug, label=None):
    a = app_by_slug[slug]
    href = a["href"]
    if "apps.apple.com" in href:
        label = label or "View on the App Store"
    else:
        label = label or "Download from GitHub"
    return f'<a class="go" href="{esc(href)}" rel="noopener">{esc(label)}{ARROW_UR}</a>'


CASES = [
    dict(slug="common-ground", flip=False, extra=store_name_note("common-ground") + " Screens are from a build in development, captured 22 October 2026.",
         body="Pick places, find where your tastes overlap, and plan trips, meetups and date nights with an assistant that runs on the phone.",
         shots=[(S["orbits1"], "Orbits plan screen asking Where to? with starters for a day out, finding food, meeting someone and a date night"),
                (S["orbits2"], "Orbits Tools for this plan sheet with saved places, Apple Maps search, routes and weather all switched on")],
         gallery=list(ORB.values()),
         gallery_note="Screens from the build in development, captured 22 October 2026 in dark mode. A fixture model stands in for the on-device model, so the answer wording is test wording."),
    dict(slug="rifflet", flip=True, extra="",
         body="Describe a tune in a few words, get a four-bar riff, then learn it with Listen, Watch and Play lessons.",
         shots=[(S["rifflet1"], "Rifflet's Make screen with a prompt box, quick idea chips, instrument tabs and a four-bar riff")]),
    dict(slug="playlist-hunter", flip=False, extra=store_name_note("playlist-hunter") + " The screen is from a demo build with a fixed sample catalog, as it says.",
         body="Ask in plain words, get songs ready to play, and save them as a playlist.",
         shots=[(S["echo1"], "EchoHunt's chat suggesting four songs from a demo catalog, with a button to save them as a playlist")]),
    dict(slug="clocktower-table", flip=True, extra="Screens are from the 1.4 playtest build.",
         body="Seat the table, deal each character in private, step through the night in order, then keep the day's nominations and votes. The host runs the table instead of the paperwork.",
         shots=[QUO[k][:2] for k in ("seat", "reveal", "night")],
         gallery=list(QUO.values()),
         gallery_note="Playtest build 1.4, captured 23 October 2026. The hub also holds Night of the Ninja and Maskmen, which are still in development."),
    dict(slug="pinprint", flip=True, extra="The screens were captured on 25 October 2026 from the current source, on the iPhone Duo simulator, with the sample trip bundled in the app. The App Store version is 1.0.",
         body="Plan the day from your saved proof, see a private map built from screenshots and saves, and keep tickets and travel documents local.",
         shots=[(S["pin1"], "Pinprint's Today screen: saved, visited and logged counts, a prompt to log one place, and a travelogue note box"),
                (S["pin2"], "Pinprint's map of the sample Bali 2026 trip, with blue pins for saved places and counts of places, sources and logged"),
                (S["pin3"], "Pinprint's Search screen with an Ask your trip box, a note that the on-device model is available, and an Ask Places box")]),
    dict(slug="breakline-surf", flip=False, extra="The screens were captured on 28 October 2026 from the current source, on the iPhone Duo simulator, with a sample badminton smash. Body position is read on the device.",
         body="Pick a clip of your surf, skate, golf, tennis or badminton move and see your body position frame by frame, with the angles that matter and nothing uploaded.",
         shots=[(S["brk1"], "Breakline home screen: sport chips for surf, skate, golf and tennis, and buttons to choose surf photos or clips, find surf media or practise a land drill"),
                (S["brk2"], "Breakline pose overlay of a badminton smash at contact, with the elbow at 165 degrees and the front knee at 141 degrees"),
                (S["brk3"], "Breakline session card for the smash: elbow at contact 165 degrees, front knee 141 degrees, 0.70 seconds from load to contact, and a Share with coach button")]),
    dict(slug="pastport", flip=True, extra="The screens use a sample history, not anyone's real browsing.",
         body="Search your Safari history in plain words, privately on your Mac. Answers are counted from what is on the device.",
         shots=[(S["pas1"], "Pastport on macOS showing what you have been into this week, a privacy check and booking pages"),
                (S["pas2"], "Pastport on macOS answering which sites were visited most, in dark mode")], wide=True),
    dict(slug="feedloom", flip=False, extra="All three screens are from the next version, which is not on the App Store yet.",
         body="Keep up with links and feeds in a reader with four looks: comic, newsprint, noir and default.",
         shots=[(S["feed1"], "Feedloom's library in its comic skin, dark, with sample bookmarks"),
                (S["feed2"], "Feedloom's library in its newsprint skin, light, with sample bookmarks"),
                (S["feed3"], "Feedloom's library in the default skin, dark")]),
]

STUDIO = [
    dict(id="maskmen", name="Maskmen and Night of the Ninja", plate="Inside the 1.4 hub · in development",
         body="Two card games in one place: play Maskmen against two bots on this device, or run Night of the Ninja as a companion for the physical cards.",
         shot=[MN["maskmen"][:2], MN["ninja"][:2]], color="#7a1627"),
    dict(id="threadmark", name="Threadmark", plate=plate_for("", "threadmark-swift") + " · in development",
         body="An evidence board that turns one question into sources you can check, with a status for every source.",
         shot=[(S["tm1"], "Threadmark evidence board on a sample question about native Swift agent dashboards")], color="#1f6f7a"),
]

HERO_ORDER = ["common-ground", "rifflet"]


def lit_style(slug_or_hex, i=0):
    c = COLORS.get(slug_or_hex, slug_or_hex)
    return f'style="--c:{c};--on:{on_color(c)};--i:{min(i, 14)}"'


def head_html():
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{NAME} · iOS apps with on-device AI</title>
<meta name="description" content="{NAME} builds iOS and macOS apps with on-device AI. Eighteen apps live, with App Store links, real screens and the work in progress.">
<meta name="theme-color" content="#0c0d0f">
<link rel="icon" href="img/icon-common-ground.webp" type="image/webp">
<link rel="preload" href="fonts/Archivo-Variable.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="css/style.css">
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches){{document.documentElement.classList.add('dim')}}</script>
</head>
<body>
<a class="skip" href="#work">Skip to the work</a>
<main class="frame">
"""


def hero_html():
    shots = {
        "common-ground": (S["orbits1"], "Orbits plan screen asking Where to?"),
        "rifflet": (S["rifflet1"], "Rifflet's Make screen in dark mode"),
        "pinprint": (S["pin1"], "Pinprint App Store screenshot: Plan the day from your saved proof"),
    }
    cells = []
    cells.append(f"""<header class="pane transom">
  <a class="mark" href="#top">{NAME}</a>
  <nav aria-label="Sections"><a href="#work">Work</a><a href="#apps">All apps</a><a href="#assistants">Assistants</a><a href="#studio">In the studio</a><a href="#how">How it is made</a></nav>
</header>""")
    cells.append(f"""<section class="wall hero" id="top" aria-labelledby="h1">
  <div class="pane p-head">
    <h1 id="h1">I build iOS apps with <span class="nb">on-device</span> AI, and I ship them.</h1>
    <p class="lede">Eighteen apps live, from music to travel to chess. Here is the work: real screens, App Store links, and what is still in the studio.</p>
  </div>
  <a class="pane note cobalt p-cta" href="{CONTACT}" onclick="openContactModal(event)" rel="noopener"><span>Work with me</span><span class="arrow">{ARROW_R}</span></a>""")
    for k, slug in enumerate(HERO_ORDER):
        nw, alt = shots[slug]
        a = app_by_slug[slug]
        cells.append(f"""  <a class="pane lit p-shot s{k + 1}" {lit_style(slug, k)} href="#{slug}" aria-label="{esc(DISPLAY.get(slug, a['name']))}: see the case">
    {phone(nw, alt, eager=(k == 0))}
  </a>""")
    cells.append(f"""  <div class="pane p-note"><p>{esc('Seventeen on the App Store, one on GitHub for Mac. Every colour below is an app that is out in the world.')}</p></div>""")
    strip = ["playlist-hunter", "feedloom"]
    for k, slug in enumerate(strip):
        a = app_by_slug[slug]
        nm = DISPLAY.get(slug, a["name"])
        cells.append(f"""  <a class="pane lit p-icon i{k + 1}" {lit_style(slug, k + 3)} href="{esc(a['href'])}" rel="noopener" aria-label="{esc(nm)} on the App Store">
    {img(icons[slug], nm + " app icon")}<span>{esc(nm)}</span>
  </a>""")
    cells.append("</section>")
    return "\n".join(cells)


def case_html(c, idx):
    slug = c["slug"]
    a = app_by_slug[slug]
    nm = DISPLAY.get(slug, a["name"])
    desc = sentence(a["description"]) if slug != "common-ground" else "Plan your own trips and meetups."
    shots = c["shots"]
    n = len(shots)
    layout = "stack" if (n >= 3 or c.get("wide")) else "side"
    text = f"""<div class="pane p-text">
    <div class="t-a">
      <h3 id="{slug}-h">{esc(nm)}</h3>
      <p class="plate">{esc(fact_plate(slug))}</p>
    </div>
    <div class="t-b">
      <p class="blurb">{esc(desc)}</p>
      <p>{esc(c['body'])}{(' ' + esc(c['extra'])) if c['extra'] else ''}</p>
      {store_link(slug)}
    </div>
  </div>"""
    screens = []
    for k, (nw, alt) in enumerate(shots):
        frame = phone(nw, alt)
        if c.get("wide"):
            frame = frame.replace('class="phone"', 'class="phone win"')
        screens.append(f"""<figure class="pane lit p-screen" {lit_style(slug, idx + k)}>
    {frame}
  </figure>""")
    cls = f"wall case {layout} n{n}" + (" flip" if (c["flip"] and layout == "side") else "") + (" wide" if c.get("wide") else "")
    inner = "\n  ".join([text] + screens) if not (c["flip"] and layout == "side") else "\n  ".join(screens + [text])
    return f"""<section class="{cls}" id="{slug}" aria-labelledby="{slug}-h">
  {inner}
</section>""" + gallery_html(c, idx, nm)


def gallery_html(c, idx, nm):
    """Every captured screen of an app, in a lit pane of its own colour. Open by default; the visitor can fold it."""
    rows = c.get("gallery")
    if not rows:
        return ""
    figs = "\n    ".join(
        f'<figure>{phone(nw, alt, width=220)}<figcaption>{esc(cap)}</figcaption></figure>' for nw, alt, cap in rows
    )
    return f"""
<section class="wall galleries" aria-label="{esc(nm)}: all screens">
  <details class="pane lit p-gallery" {lit_style(c['slug'], idx)} open>
    <summary>All {len(rows)} screens</summary>
    <div class="shots">
    {figs}
    </div>
    <p class="plate">{esc(c['gallery_note'])}</p>
  </details>
</section>"""


def work_html():
    out = ['<h2 class="sr-only" id="work">Selected work</h2>']
    for i, c in enumerate(CASES):
        out.append(case_html(c, i))
    return "\n".join(out)


def app_desc(slug):
    a = app_by_slug[slug]
    if slug == "common-ground":
        return f"Plan your own trips and meetups. {store_name_note(slug)}"
    return sentence(a["description"])


def more_html():
    """Two live apps without a full case: current screens, captured from source, beside their store links."""
    rows = [
        ("lineage-mirror", "Screens: the Mirror and Journal tabs, from the current source on the iPhone Duo simulator, 25 October 2026. The app says it is for reflection and is not DNA proof.",
         [("lineage-mirror-pattern", "Lineage Mirror's Mirror tab: a headline, a note that it is reflection only and not DNA proof, and a Your Pattern card with two family lines and trait chips", "Mirror"),
          ("lineage-mirror-journal", "Lineage Mirror's Journal tab with three reflection prompts and a journal box asking what was inherited that is worth keeping", "Journal")]),
        ("flickpot", "Screens: the table and the first-run How to Play, from the current source on the iPhone Duo simulator, 25 October 2026. The coins carry market tickers.",
         [("flickpot-table", "Flickpot's table: eleven coins carrying market tickers on a green felt board, with Tiny, Big and All risk buttons above it", "The table"),
          ("flickpot-how-to-play", "Flickpot's How to Play, step 1, Flick a Coin, with a drawing of a coin and a pocket on the table", "How to Play")]),
    ]
    out = []
    for i, (slug, note, shots) in enumerate(rows):
        a = app_by_slug[slug]
        figs = "".join(
            f'<figure>{phone(MORE_IMG[k], alt, width=210)}<figcaption>{esc(cap)}</figcaption></figure>' for k, alt, cap in shots
        )
        out.append(f"""<article class="pane lit p-more" {lit_style(slug, i)}>
    <div class="m-copy">
      <h3>{esc(a['name'])}</h3>
      <p class="plate">{esc(fact_plate(slug))}</p>
      <p class="blurb">{esc(sentence(a['description']))}</p>
      <p>{esc(note)}</p>
      {store_link(slug)}
    </div>
    <div class="shots">{figs}</div>
  </article>""")
    return f"""<section class="wall more" aria-labelledby="more-h">
  <div class="pane p-title"><h2 id="more-h">Two more, up close</h2><p>Two of the other live apps, with current screens.</p></div>
  {chr(10).join('  ' + x for x in out)}
</section>"""


def apps_html():
    spans = [4, 4, 4, 6, 3, 3, 3, 3, 6, 4, 4, 4, 6, 6, 3, 3, 3, 3]  # eighteen panes, every row sums to twelve
    cells = []
    for i, a in enumerate(apps):
        slug = a["slug"]
        nm = DISPLAY.get(slug, a["name"])
        sp = spans[i % len(spans)]
        cells.append(f"""<a class="pane lit p-app" {lit_style(slug, i)} style-span="{sp}" href="{esc(a['href'])}" rel="noopener" data-span="{sp}">
    {img(icons[slug], nm + " app icon")}
    <span class="nm">{esc(nm)}</span>
    <span class="ds">{esc(app_desc(slug))}</span>
  </a>""".replace(' style-span="%d"' % sp, ""))
    return f"""<section class="wall apps" id="apps" aria-labelledby="apps-h">
  <div class="pane p-title"><h2 id="apps-h">All eighteen</h2><p>Each pane links to the app on the App Store, or to the download for the Mac app.</p></div>
  {chr(10).join('  ' + c for c in cells)}
</section>"""


def assistants_html():
    ph = "".join(phone(ORB[k][0], ORB[k][1], width=170) for k in ("tools-on", "tools-off", "refused"))
    return f"""<section class="wall assist" id="assistants" aria-labelledby="assist-h">
  <div class="pane p-title"><h2 id="assist-h">Assistants that run on the phone</h2><p>Three of the apps have one. Each can only use the few tools it is given, and the limits are part of the screen.</p></div>
  <article class="pane frost p-assist a-orbits">
    <div class="a-copy">
      <h3>Orbits</h3>
      <p>The planner has four tools: your saved places, Apple Maps search, routes and weather. Each has a switch. Turn weather off and Orbits says it cannot answer instead of guessing.</p>
      <p class="plate">Build in development, 22 October 2026 · fixture model standing in for the on-device one</p>
    </div>
    <div class="shots">{ph}</div>
  </article>
  <article class="pane frost p-assist a-quorion">
    <div class="a-copy">
      <h3>{esc(app_by_slug["clocktower-table"]["name"])}</h3>
      <p>The host's assistant can call exactly three tools, and nothing else. The model proposes and the rules decide: a suggestion that names a dead seat or an unknown one is thrown out and the plain rule is used instead.</p>
      <p class="plate">In development · covered by unit tests, no screens of it yet</p>
    </div>
    <ol class="a-tools">
      <li><strong>Role counts</strong> Checks that the mix of characters fits the number of players.</li>
      <li><strong>Night order</strong> Works out who wakes, and when, for the first night or any later one.</li>
      <li><strong>Bluff sets</strong> Builds three sets of three characters to bluff with, and refuses when fewer than three qualify.</li>
    </ol>
  </article>
  <article class="pane frost p-assist a-glint">
    <img class="bgblur" src="img/{GL_ASK_ANSWER[0]}" alt="" aria-hidden="true">
    <div class="a-copy">
      <h3>Glint</h3>
      <p>Ask Glint calls a tool before it answers a question about a move. Ask why BTCUSDT is moving and it reads the last day of price and volume, says what it found, and lists where each number came from under the answer. It has no order tools: the first thing it says is that it never places orders.</p>
      <p class="plate">In development · the answer is from a build that is not merged yet, captured 25 October 2026 on the iPhone Duo simulator, signed out, on the on-device model and live public Binance prices</p>
    </div>
    <div class="shots">
      <div>{phone(GL_ASK, "Ask Glint on the phone: a ticker strip of live BTC and ETH prices, the line that it never places orders, and suggested questions", width=230)}<p>Before you ask. Captured 24 October.</p></div>
      <div>{phone(GL_ASK_ANSWER, "Ask Glint answering why BTCUSDT is moving: the day's change and range, the biggest hourly bar and its volume, with a Sources list under the answer", width=230)}<p>An answer, with its sources. 25 October.</p></div>
    </div>
  </article>
</section>"""


def chart_html():
    """Glint's price line chart sheet (four screens) and the native candle chart (one render)."""
    shots = [
        (GL_LINE_UP, "Glint's chart sheet as a price line, with a green line for a rising period, range buttons 1M, 3M, 1Y and All, and a note that the data is a sample and not a live price", "Rising, light. Sample data."),
        (GL_LINE_DOWN, "Glint's chart sheet in dark mode with a red price line for a falling month, and a note that the data is a sample and not a live price", "Falling, dark. Sample data."),
        (GL_LINE_SCRUB, "Glint's price line while scrubbing: a vertical cursor and a dot on the line, with the price and the date and time under the finger shown above the chart", "Scrubbing. Sample data."),
        (GL_LINE_LIVE, "Glint's chart sheet on a live public Binance price for BTCUSDT, with a Line and Candles switch, a green price line and range buttons", "Live: public Binance prices, signed out."),
    ]
    figs = "\n  ".join(
        f'<figure class="pane frost p-screen"><img class="bgblur" src="img/{nw[0]}" alt="" aria-hidden="true">{phone(nw, alt, width=250)}<figcaption>{esc(cap)}</figcaption></figure>'
        for nw, alt, cap in shots
    )
    return f"""<details class="fold" open>
  <summary class="pane frost"><span class="fold-t">The chart sheet and native candles<span class="plate">Glint · five screens · in development</span></span></summary>
  <div class="fold-body">
<section class="wall studio glint chart stack n4" aria-labelledby="chart-h">
  <div class="pane frost p-text">
    <div class="t-a">
      <h3 id="chart-h">The chart sheet</h3>
      <p class="plate">Latest main · rendered and captured 24 October 2026 · in development</p>
    </div>
    <div class="t-b">
      <p>Open a name in Glint and its chart starts as one price line. Pick 1M, 3M, 1Y or All, and the line is green or red by how the period went. Touch and drag along it to read the price and the time under your finger. Candles stay one tap away. Three of the four screens are Xcode previews with a fixed sample walk, and the picture says so. The fourth is the running app on live public Binance prices.</p>
    </div>
  </div>
  {figs}
</section>
<section class="wall studio glint candles" aria-labelledby="candles-h">
  <figure class="pane frost p-screen"><img class="bgblur" src="img/{GL_CANDLES[0]}" alt="" aria-hidden="true">{phone(GL_CANDLES, "Glint's native candle chart in dark mode, with candles, two moving-average lines, a stop level, volume bars and a note that the data is a sample and not a live price", width=270)}<figcaption>Native candles. Sample data.</figcaption></figure>
  <div class="pane frost p-text">
    <h3 id="candles-h">Native candles</h3>
    <p>The candle chart, drawn natively instead of in a web view: candles, two moving averages, volume and a stop level, over the same chart frame as the price line. It is the next step after the price line.</p>
    <p class="plate">An Xcode preview with sample data, 24 October 2026. The work is on a branch that is not merged yet, so it is in no build.</p>
  </div>
</section>
  </div>
</details>"""


def studio_html():
    g = G
    gl = f"""<section class="wall studio glint stack n3" id="studio" aria-labelledby="studio-h">
  <div class="pane frost p-text">
    <div class="t-a">
      <h2 id="studio-h">In the studio</h2>
      <p class="blurb">Work that is not out yet. Frosted glass means in development.</p>
    </div>
    <div class="t-b">
    <h3>Glint</h3>
    <p>A native Swift market desk with live watchlists, sector heatmaps, a portfolio view, a chart sheet and a Live Activity that frames the trading day like a cricket innings. Orders stay locked. The three phones and the Lock Screen card below are Xcode previews with sample numbers.</p>
    <p class="plate">{esc(plate_for('', 'glint-swift'))} · in development</p>
    </div>
  </div>
  <figure class="pane frost p-screen"><img class="bgblur" src="img/{g[0][0]}" alt="" aria-hidden="true">{phone(g[0], "Glint's market overview card with a sample NIFTY 50 chart, labelled illustrative and not a live quote")}</figure>
  <figure class="pane frost p-screen"><img class="bgblur" src="img/{g[1][0]}" alt="" aria-hidden="true">{phone(g[1], "Glint's sector heatmap for India with sample sector moves in green and red tiles")}</figure>
  <figure class="pane frost p-screen"><img class="bgblur" src="img/{g[2][0]}" alt="" aria-hidden="true">{phone(g[2], "Glint's portfolio screen with sample positions and a note that profit and loss is missing for some")}</figure>
  <figure class="pane frost p-wide"><img class="bgblur" src="img/{G_WIDE[0]}" alt="" aria-hidden="true">{img(G_WIDE, "Glint's Lock Screen Live Activity: a NIFTY day scorecard showing plus 56 points, 4.0 overs and a closed timer")}<figcaption>The Lock Screen Live Activity: the NIFTY day as a scorecard.</figcaption></figure>
</section>
{chart_html()}
<section class="wall studio glint live" aria-labelledby="live-h">
  <figure class="pane frost p-live"><img class="bgblur" src="img/{GL_WATCH[0]}" alt="" aria-hidden="true">
    <figcaption id="live-h"><strong>Running now.</strong> The latest build, signed out, on public Binance prices. Captured 24 October 2026 on the iPhone Duo simulator.</figcaption>
    <div class="shots">
      <div>{phone(GL_WELCOME, "Glint's welcome screen in the latest build")}<p>Welcome</p></div>
      <div>{phone(GL_WATCH, "Glint's watchlist with live public Binance prices for BTC, ETH and a gold contract, and a Sign in banner")}<p>Watchlist, live prices</p></div>
    </div>
  </figure>
  <div class="pane frost p-truth">
    <h3>What is real here</h3>
    <dl>
      <div><dt>Live</dt><dd>Prices for BTC, ETH and gold come straight from Binance's public stream.</dd></div>
      <div><dt>Sample</dt><dd>Positions, profit and loss, the NIFTY chart, the sector heatmap and the Live Activity are Xcode previews with made-up numbers.</dd></div>
      <div><dt>Paper only</dt><dd>Trade tickets are simulated. Nothing in the app sends an order.</dd></div>
      <div><dt>Never shown</dt><dd>Any real account, balance or position.</dd></div>
    </dl>
  </div>
</section>"""
    xth = XTH
    xcells = "\n  ".join(
        f'<figure class="pane frost p-screen"><img class="bgblur" src="img/{nw[0]}" alt="" aria-hidden="true">{phone(nw, alt, width=190)}<figcaption>{esc(cap)}</figcaption></figure>'
        for nw, alt, cap in [xth[k] for k in ("discover", "event", "entry", "mine", "rankings", "profile")]
    )
    xt = f"""<section class="wall studio xth stack" aria-labelledby="xth-h">
  <div class="pane frost p-text">
    <div class="t-a">
      <h3 id="xth-h">Xthlete</h3>
      <p class="plate">Concept · first commit 5 Oct 2026 · sample data</p>
    </div>
    <div class="t-b">
      <p>A native SwiftUI concept for tournament discovery, entries, player profiles and rankings. Its navy, white and blue and its court photo come from the public Xthlete site. Every event, price, athlete and ranking is made up, and an entry only saves a note on the phone: nothing is sent and nothing is charged.</p>
    </div>
  </div>
  {xcells}
</section>"""
    smalls = []
    for s in STUDIO:
        shot = s["shot"]
        bgs = f'<img class="bgblur" src="img/{shot[0][0][0]}" alt="" aria-hidden="true">'
        ph = "".join(phone(nw, alt, width=170) for nw, alt in shot)
        smalls.append(f"""<article class="pane frost p-small">{bgs}
    <h3>{esc(s['name'])}</h3>
    <p>{esc(s['body'])}</p>
    <p class="plate">{esc(s['plate'])}</p>
    <div class="mini">{ph}</div>
  </article>""")
    return gl + "\n" + xt + f"""
<section class="wall studio small" aria-label="More work in development">
  {chr(10).join('  ' + x for x in smalls)}
</section>"""


def how_html():
    return f"""<section class="wall how" id="how" aria-labelledby="how-h">
  <div class="pane p-text">
    <h2 id="how-h">How it is made</h2>
    <p>New flows start as a clickable prototype, and screens get rendered in Xcode before they ship. These three are Xcode previews, taken on 24 October 2026 with sample data.</p>
  </div>
  <figure class="pane p-render">{phone(S['rp1'], "Xcode preview of the Orbits launch screen, Make something happen")}<figcaption>Orbits, launch screen</figcaption></figure>
  <figure class="pane p-render">{phone(S['rp2'], f"Xcode preview of {app_by_slug['clocktower-table']['name']}'s storyteller comic play screen in dark mode")}<figcaption>{esc(app_by_slug['clocktower-table']['name'])}, dark mode</figcaption></figure>
  <figure class="pane p-render">{phone(S['rp3'], "Xcode preview of Glint's portfolio screen with sample positions")}<figcaption>Glint, sample positions</figcaption></figure>
  <div class="pane p-text steps">
    <p><strong>Prototype first.</strong> A new flow is drawn as a page I can click through before I write Swift.</p>
    <p><strong>Render before it ships.</strong> Xcode previews show dark mode and large text before a build goes out.</p>
    <p><strong>Keep it on the device.</strong> Many of these apps do their thinking on the phone.</p>
  </div>
</section>"""


def close_html():
    return f"""<section class="wall close" aria-labelledby="close-h">
  <div class="pane note oxblood p-big">
    <h2 id="close-h">Have an app that should exist?</h2>
    <p>Tell me what it should do and who it is for.</p>
  </div>
  <a class="pane note cobalt p-go" href="{CONTACT}" onclick="openContactModal(event)" rel="noopener"><span>Work with me</span><span class="arrow">{ARROW_R}</span></a>
  <div class="pane p-links"><a href="{BLOG_HOME}" rel="noopener">Blog</a><a href="{GITHUB}" rel="noopener">GitHub</a></div>
</section>
<footer class="pane foot"><p>{NAME}. App list, links and descriptions come from the blog. Page built {BUILT}.</p></footer>
</main>
<a class="dock" href="{CONTACT}" onclick="openContactModal(event)">Work with me</a>
{MODAL}<script src="js/main.js"></script>
</body>
</html>
"""


def build():
    for sub in ("css", "js", "fonts"):
        (SITE / sub).mkdir(parents=True, exist_ok=True)
    for name in ("Archivo-Variable.ttf", "OFL-Archivo.txt"):
        keep = PUBLISHED / "fonts" / name
        if not keep.exists():
            sys.exit(f"{keep} is missing")
        if keep.resolve() != (SITE / "fonts" / name).resolve():
            shutil.copyfile(keep, SITE / "fonts" / name)
    shutil.copy(HERE / "style.css", SITE / "css/style.css")
    shutil.copy(HERE / "main.js", SITE / "js/main.js")
    page = head_html() + hero_html() + "\n" + work_html() + "\n" + more_html() + "\n" + apps_html() + "\n" + assistants_html() + "\n" + studio_html() + "\n" + how_html() + "\n" + close_html()
    (SITE / "index.html").write_text(page, encoding="utf8")
    used = set(re.findall(r"img/([\w.-]+\.webp)", page))
    if used != USED:
        sys.exit(f"images made but not on the page: {sorted(USED - used)}; on the page but not made: {sorted(used - USED)}")
    if set(PROV) != USED:
        sys.exit(f"provenance.json entries with no image on the page: {sorted(set(PROV) - USED)}")
    for f in (SITE / "img").iterdir():
        if f.name not in used:
            f.unlink()
            print("pruned", f.name)
    print("built", len(page), "bytes;", len(USED), "images,", sum(1 for e in PROV.values() if e["frozen"]), "kept as published")


if __name__ == "__main__":
    build()
