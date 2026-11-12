---
title: "Traceshot: a replay of one public Hacker News thread"
date: '2026-11-12'
excerpt: "A 21-second iPhone simulator recording of Traceshot following a public Hacker News story to its GitHub repository and the repositories linked in the comments, and drawing them as a web."
categories: [traceshot, swiftui, ios]
keywords: [traceshot, hacker-news, github, swiftui-canvas, trace-web, ios-27]
type: post
---

Traceshot follows the links in a public page and draws what it finds as a web. This is a replay: the
Hacker News story [Show HN: Three new Kitten TTS models](https://news.ycombinator.com/item?id=47441546)
goes in, and a web grows from it.

[![The finished Traceshot web: the Hacker News story at the centre, its GitHub repository, demo page and the repositories linked in the comments around it](/showcase/media/traceshot-poster.jpg)](/showcase/media/traceshot-kitten-hn-trace.mp4)

[Watch the 21-second recording](/showcase/media/traceshot-kitten-hn-trace.mp4) (MP4, 1.1 MB), or see it on
the [showcase](/showcase/index.html#traceshot-demo) and at [getalcor.com/traceshot](https://getalcor.com/traceshot/).

## What the recording shows

- The story links the repository `KittenML/KittenTTS`. From the repository the trace reaches its Hugging Face
  demo page, its website and two more repositories from the same organisation.
- Five repositories that people linked in the story's comments hang off the story itself.
- Every strand keeps the page that stated it, and says how sure Traceshot is. **Observed**: two different
  sources each state the link, as when a comment links a repository and that repository's own description
  says it is a Kitten TTS demo. **Linked**: one side declares it. **Needs verification**: only a name
  matches. One strand in the recording is the third kind: two web demos with similar names that no page
  links to each other.

## What it is not

- It is not a live run. The 14 steps were built by a script from public pages (the Hacker News API, the
  GitHub API and the repository's README), and the app played them back.
- It was recorded in the iPhone simulator. Traceshot has not been run on a real iPhone yet. The view is a
  plain SwiftUI `Canvas`, so it should run on one, but I have not checked.
- It reads public pages only and never writes anywhere. The repositories named in the web are public
  and were linked in a public thread.
