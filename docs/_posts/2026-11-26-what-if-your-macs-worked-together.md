---
title: "What if your Macs worked together?"
date: '2026-11-26'
excerpt: "MacItWork starts with a build or test on another Mac. The larger idea is a team of machines that can talk and work together."
categories: [macitwork, macos, agents]
keywords: [swift, mac, build, agents, collaboration]
type: post
---

“Test this project on whichever Mac is free.”

That sounds like a reasonable request when you have more than one Mac. Making it dependable is the interesting part: which Mac is available, what exactly will it run, who approves, and how do you know what happened?

[MacItWork](https://macit.work/) is an exploration of that problem. The broader picture I have in mind is a group of Macs talking aloud and working together according to their skills. The current product direction starts with a narrower job: an approved build or test on a paired Mac.

## From a request to a receipt

The project's documented flow is straightforward: turn a request into a declared action, choose a paired Mac within its limits, ask for approval, run the job, and return a signed receipt. The app's documentation describes checks such as available disk, temperature and battery when choosing a machine.

The difference between “the model made a plan” and “the other Mac ran the job” matters. A suggested action is just that until it is approved and executed. A receipt is useful because it makes the outcome something you can inspect, rather than a reassuring sentence in a chat.

The project documentation describes the 0.1.7 design and its limits. I haven't freshly tested pairing, remote execution, and receipt verification end to end for this post, so treat that documentation as the intended behavior of that version, not a fresh live demonstration.

## What comes after the build?

A machine that can safely accept one well-defined task is a starting point. The more ambitious question is how different machines—and the people using them—coordinate a sequence of work without losing track of what each one can do.

That is where the “Macs talking” idea gets interesting. A voice could make activity visible across a room; skills could explain why one machine is a good fit. But those are directions to explore, not a claim that a fleet of autonomous Macs is already doing them.

For now, the question worth answering is smaller and measurable: can I ask for a specific test, approve it, and trust the result I get back?
