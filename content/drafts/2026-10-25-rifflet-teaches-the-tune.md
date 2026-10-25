---
draft: true
title: "Rifflet teaches you the tune it just made"
date: '2026-10-25'
categories: [building, apps, music]
keywords: [Rifflet, iOS, on-device AI, piano, guitar, ukulele]
slug: /rifflet-teaches-the-tune
published: false
---

<!--
DRAFT, NOT PUBLISHED. content/drafts/ is not read by the site build.

Before publishing:
1. Owner line: add one sentence on why you built Rifflet. Nothing in the repo or the store listing says, so none is invented here.
2. Release status as of 2026-10-25 (asc read-only): 1.5 is live on the US store; build 1.6 (16) is VALID and in TestFlight; no 1.6 App Store version exists yet. Reword "sitting in TestFlight" to match what is true on the day.
3. The 1.6 list below comes from commit subjects merged before the 1.6 (16) upload (KeyMuse repo, 2026-10-21 to 2026-10-23). Confirm each against the build or its TestFlight notes before listing it.
4. Image: only one usable capture exists in the repo. KeyMuse/screenshots/2026-10-21/make-iphone17-light.png is dark mode too, both make-duo-*.png files are blank black, and docs/screenshots/mac-app-2026-05-08.png is from May with no riff loaded. Replace the capture with a fresh run of 1.6 (ideally Guitar or Ukulele, and the coach tip) if you want more than one picture.
5. On publish: git mv content/drafts/rifflet-1-6 public/screenshots/rifflet, move this file to docs/_posts/, set draft: false and published: true.
-->

# Rifflet teaches you the tune it just made

Rifflet starts with a sentence. You type something like "warm lo-fi piano loop", tap Make my tiny tune, and a four-bar riff comes back at 92 BPM. Then the app does the part I care about: it shows you how to play it.

![Rifflet's Make screen on an iPhone simulator: the prompt "warm lo-fi piano loop", the Make my tiny tune button, Piano, Guitar and Ukulele tabs, Listen, Watch and Play modes, and a four-bar riff at 92 BPM with Loop on.](/screenshots/rifflet/make-iphone17-dark.jpg)

*Simulator capture, 21 October 2026.*

Pick Piano, Guitar or Ukulele. Listen to the tune once. Watch the notes as keys or tab. Then play it yourself. The riff loops four bars at a time, so the phrase stays under your hands while you learn it.

That is the whole app, and I kept it that small on purpose. There is no account, no sign-in and no cloud AI key to paste in. The sound is generated on the phone.

When I added coaching in 1.5 I held to one rule: the AI never touches the music. On an iPhone with Apple Intelligence, Rifflet can offer one short tip while you practice, the next thing to try. The notes and the timing still come from the music engine. The tip only explains the next move. A wrong tip is a bad suggestion. It cannot be a wrong note.

## What is next

1.6 is built and sitting in TestFlight as I write this. Most of it is the unglamorous work that lets more people use the app:

- landscape on iPhone
- fixed-height controls that grow with Dynamic Type
- an Easy colours option, with a ring around the target key so the colours never hide it
- a two-pane layout for the iPhone Duo that keeps your lesson when it folds or unfolds
- Make it sadder, a mood shift that follows fixed rules instead of a model, with undo

Rifflet is free, rated 4+, and needs iOS 17 or later. 1.5 is the version on the [App Store](https://apps.apple.com/us/app/rifflet/id6767064984) today.
