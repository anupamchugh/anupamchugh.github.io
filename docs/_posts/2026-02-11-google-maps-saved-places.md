---
title: 'gmaps-list: a CLI to export Google Maps saved places'
date: '2026-02-11T12:00:00.000Z'
categories: [notes]
keywords: ['google-maps', 'cli', 'python', 'places']
slug: /google-maps-saved-places
type: note
---

I had 95 saved restaurants in Google Maps. No way to export them. Google Takeout strips list names, third-party tools break past 20 items.

Shared list pages have a `<link rel="preload">` pointing to an undocumented `entitylist/getlist` endpoint. It returns everything — names, addresses, coordinates, place IDs. Strip the XSSI prefix (`)]}'`), parse the nested arrays, done.

Built a CLI:

```bash
pip install gmaps-list
gmaps-list "https://maps.app.goo.gl/..." --format table
```

95 places in 3 seconds. JSON, CSV, or table output. ~150 lines of Python, no headless browser.

The array indices are positional (no keys): `item[1][5][2]` is latitude, `item[1][7]` is the Google Place ID. Mapped empirically by diffing responses from different list sizes.

Also built a Swift CLI on top of this that does scoring, visit tracking, and place-to-place comparison between two lists.

[gmaps-list on GitHub](https://github.com/anupamchugh/gmaps-list)
