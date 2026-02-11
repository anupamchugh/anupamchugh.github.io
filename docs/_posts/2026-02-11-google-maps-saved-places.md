---
title: 'Your saved places say more about you than your dating profile'
date: '2026-02-11T12:00:00.000Z'
categories: [notes]
keywords: ['google-maps', 'cli', 'python', 'places', 'placematch']
slug: /google-maps-saved-places
type: note
---

Nobody saves "Qureshi's Kabab Corner" to impress a date. They save it because they want to go there. Google Maps saved places are the most honest signal of who you are — curated for yourself, not an audience.

Problem is, there's no way to get them out. Google Takeout strips list names. Third-party tools break past 20 items. So I reverse-engineered the undocumented `entitylist/getlist` endpoint that Google's own shared list pages use. Strip the XSSI prefix (`)]}'`), parse the positional arrays (`item[1][5][2]` is latitude, `item[1][7]` is the place ID), done.

```bash
pip install gmaps-list
gmaps-list "https://maps.app.goo.gl/..." --format table
```

95 places in 3 seconds. ~150 lines of Python, no headless browser.

Then I built [PlaceMatch](https://anupamchugh.github.io/placematch/) — paste two Google Maps list URLs, swipe through your places ("been here" / "want to go" / "skip"), and see how you match. It tells you what you've both visited, where you both want to go, places you can show each other, and spots in the same neighborhood you didn't know about.

Dating apps need a million users to find you one person. This needs two people and a Google Maps list.

[gmaps-list on GitHub](https://github.com/anupamchugh/gmaps-list) / [Try PlaceMatch](https://anupamchugh.github.io/placematch/)
