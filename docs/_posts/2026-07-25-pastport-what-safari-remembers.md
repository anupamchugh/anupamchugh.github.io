---
draft: true
title: "Pastport: What Safari Remembers"
date: '2026-07-25'
categories: [building, privacy, ai]
keywords: [Safari, macOS, Foundation Models, privacy, local AI]
slug: /pastport-what-safari-remembers
published: false
---

# Pastport: What Safari Remembers

Safari history looks like a list of pages until you ask it a better question.

Then it becomes a diary you never meant to write.

It remembers the hotel you compared three times, the flight you eventually booked, the search burst that was really a decision, and sometimes the exact place an app sent you after you tapped “continue.” None of this requires a surveillance company. Safari is already keeping it locally.

I built [Pastport](https://github.com/anupamchugh/pastport) to make that record legible without sending it anywhere.

The important design decision is not the model. It is the boundary around the model.

Swift computes the facts: movements, bookings, travel, threads, trackers. The model receives a small evidence packet and turns it into a sentence. If the evidence does not contain an answer, the intended answer is “I don’t know.”

That sounds obvious. It is not how most “chat with your data” demos are built. Give a model a large dump and it will helpfully fill in the shape of the story. It may be right about the world and still wrong about you.

Pastport has a test for that failure mode. A sentence is grounded only if its claims are members of the evidence Swift computed. The detector does not ask whether a model sounds plausible. It asks whether the model stayed inside the room.

The app is deliberately unsandboxed because Safari’s protected history database requires Full Disk Access. That is a real tradeoff, so the release is signed and notarized, and the permission is explicit. The demo mode uses only fictional `.example` rows for screenshots.

The first public release is small: a menu-bar app, a CLI, deterministic detectors, and an on-device Foundation Models path. No cloud account. No hosted vector database. No “AI memory” subscription.

Just a question I keep coming back to:

> If your computer is already keeping a diary, should you at least be allowed to read it?

Pastport is my answer: yes, but the answer should stay on your Mac.
