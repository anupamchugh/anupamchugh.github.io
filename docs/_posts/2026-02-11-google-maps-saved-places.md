---
title: 'I Reverse-Engineered Google Maps to Export My Saved Places'
date: '2026-02-11T12:00:00.000Z'
categories: ['tools', 'reverse-engineering']
keywords: ['google-maps', 'cli', 'python', 'places', 'export']
slug: /google-maps-saved-places
---

I have 95 saved restaurants in Google Maps. I've visited 3 of them.

Google gives you no way to export this data. No API, no CSV download, no bulk actions. The official "Takeout" export gives you KML files with coordinates but strips the list structure. Third-party tools either require a browser extension (trust them with your Google session?) or break after 20 items.

So I reverse-engineered their internal API and built a CLI tool that extracts everything in under 5 seconds.

## The Problem

When you save a place to a list in Google Maps, that data is locked inside Google's ecosystem. You can:

- Browse one place at a time on your phone
- Share a list link (but others can only *view* it, not export)
- Use Google Takeout (loses list names, gives you coordinates in KML)

What you **cannot** do:

- Export your lists as JSON, CSV, or any machine-readable format
- Search across all your saved places at once
- Compare your saved places with someone else's
- Build anything on top of your own data

## The Discovery

When you open a shared Google Maps list link, the page loads places via a preloaded API call. Open the page source and search for `entitylist/getlist` — there's a `<link rel="preload">` tag pointing to an undocumented endpoint:

```
https://www.google.com/maps/rpc/entitylist/getlist?authuser=0&hl=en&pb=...
```

This endpoint returns the full list data — all place names, addresses, coordinates, and Google Place IDs. No authentication required for public/shared lists.

The catch? The response starts with an XSSI protection prefix:

```
)]}'
[[null,null,...
```

Strip those 5 characters, and you get a deeply nested JSON array. The structure:

```
outer[0][4]  → list name
outer[0][3]  → [owner name, avatar, id]
outer[0][8]  → array of place items
  each item[2]    → place name
  each item[1][2] → address
  each item[1][5][2] → latitude
  each item[1][5][3] → longitude
  each item[1][7]    → Google Place ID
```

No documentation exists for this. I mapped the indices by diffing responses from lists of different sizes.

## The Tool

I built `gmaps-list`, a Python CLI that wraps this into a single command:

```bash
pip install gmaps-list
```

Then:

```bash
# JSON output (default)
gmaps-list "https://maps.app.goo.gl/your-list-link"

# CSV for spreadsheets
gmaps-list "https://maps.app.goo.gl/..." --format csv > places.csv

# Human-readable table
gmaps-list "https://maps.app.goo.gl/..." --format table

# See list metadata on stderr
gmaps-list "https://maps.app.goo.gl/..." -v
```

That's it. URL in, structured data out. No API key, no headless browser, no authentication.

The core parser is ~150 lines of Python. It follows the short-link redirect, extracts the `getlist` URL from the HTML, fetches the JSON, strips the XSSI prefix, and walks the nested arrays.

### Under the Hood

The only tricky part is the XSSI prefix stripping. Google prepends `)]}'` followed by a newline to prevent direct `<script>` tag injection. Standard JSON parsers choke on it:

```python
def strip_xssi(raw: str) -> str:
    i = 0
    while i < len(raw) and raw[i] in ")]}'\n\\":
        i += 1
    return raw[i:]
```

After stripping, it's regular JSON — but arrays, not objects. Every field is positional. `item[1][5][2]` is latitude. There are no keys, just indices that I mapped empirically.

## What I Built On Top

Once you can extract places as structured data, interesting things become possible.

### PlaceVault CLI (Swift)

A local-first CLI that manages all your saved places:

```bash
# Import from a shared link
placevault fetch "https://maps.app.goo.gl/..."

# Find places near you, ranked by a scoring algorithm
placevault pick --lat 28.45 --lng 77.09

# Track visits and streaks
placevault done <place-id> --rating 5 --note "Amazing biryani"
placevault streak

# Export as a visual card grid
placevault export grid --out /tmp/my-places
```

The scoring engine uses distance (Haversine), visit recency, and list priority weights to surface recommendations. Never-visited places get a +30 point boost. Recently visited places get penalized. It's basically Tinder for your own restaurant list.

### PlaceMatch: Compatibility from Saved Places

Here's the fun application. What if you could compare two people's saved places and compute a compatibility score?

```bash
placevault compare "https://maps.app.goo.gl/list1" "https://maps.app.goo.gl/list2"
```

The algorithm blends:
- **Name overlap** (Jaccard similarity on normalized place names) — weighted 60%
- **Geo overlap** (fraction of places within 500m of each other) — weighted 40%

The insight: Google Maps saved places are the most honest compatibility signal. Unlike dating profiles, you curate saved places for yourself, not an audience. If two people independently saved the same obscure ramen shop, that means something.

## Why This Matters

Google has your place data. You should too. The entitylist/getlist endpoint is undocumented and could change — but right now it works, and the extracted data is yours to keep.

If you have saved places in Google Maps, try it:

```bash
pip install gmaps-list
gmaps-list "YOUR_SHARED_LIST_URL" --format table
```

Share your list URL with a friend, run `placevault compare`, and see what you have in common. You might be surprised.

## Links

- [gmaps-list on GitHub](https://github.com/anupamchugh/gmaps-list) — Python CLI, MIT license
- [PlaceVault on GitHub](https://github.com/anupamchugh/PlaceVault) — Swift CLI with full scoring engine

---

*Built with frustration and curl. No headless browsers were harmed.*
