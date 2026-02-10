---
draft: false
title: "Facebook's agents still run. Apple keeps wiping their memory."
date: '2026-02-04T12:00:00.000Z'
categories: [privacy, mobile, adtech]
keywords: [att, idfa, skadnetwork, adattributionkit, universal-links, facebook, apple]
slug: /facebooks-agents-still-run-apple-keeps-wiping-their-memory
published: true
---

In 2020 I wrote that Apple's iOS 14 privacy popup would crush the deep links used for ad tracking. Facebook warned of 50% revenue drops. Advertisers panicked. Four years later, we have the receipts — and the story is stranger than anyone predicted.

Before iOS 14.5, any app with Facebook's SDK could grab your device's advertising identifier without asking. That identifier was constant. It followed you everywhere. Facebook's SDK ran inside hundreds of thousands of apps, and every one of them fed data back. The identifier let Facebook match your Uber rides to your Instagram likes to the shoes you browsed on a website you'd already forgotten. Think of it as an agent with unrestricted memory — it could read everything about you, share it with anyone, and remember forever. The advertiser was the handler. Apple didn't fire the agent. They wiped its memory.

iOS 14.5 introduced a single popup: "Allow this app to track your activity across other companies' apps and websites?" Over 90% of users in the U.S. chose no. The identifier started returning all zeros. Facebook's cross-app surveillance network went dark. In February 2022, Meta's CFO admitted the impact: a $10 billion headwind. The stock lost $200 billion in market cap in a single day.

What Apple did next is the interesting part. They didn't just kill tracking — they rebuilt attribution measurement from the ground up, with privacy as a structural constraint. SKAdNetwork, and later AdAttributionKit, gave advertisers what they actually needed: proof that an ad worked, without knowing who saw it. No user ID, no device ID. Just an anonymous postback: "Someone who saw campaign 1234 installed your app and reached conversion level 42." Not "John Smith, age 34, who ordered pizza last Tuesday."

The system gets cleverer at scale. Apple introduced crowd anonymity — an ad network only receives detailed attribution data when enough people took the same action. If you're the only person who clicked an ad and installed an app, the advertiser learns almost nothing. Only when the crowd is large enough does granular data flow, and even then it's aggregate, never individual. The agent can only share a memory if enough other agents have the same memory. Individual experiences stay private. Only patterns emerge.

Deep links came back too. The old kind could do anything — no verification, no consent, any app could claim any URL and pass any tracking data. Universal links replaced them with mutual verification: the website declares which apps can handle its URLs, the app declares which domains it handles, and the system verifies both sides before routing. The agent can only do what both parties agreed to. At WWDC 2024, Apple used this to rebuild re-engagement attribution — advertisers could measure campaigns for apps users already had installed, through universal links, with no ability to identify the user.

WWDC 2025 shipped more: overlapping conversions, cooldown timers to prevent credit-stealing between campaigns, country codes that only unlock when cohorts cross anonymity thresholds. Better measurement without better surveillance. Apple keeps patching the system like a live service game — every update gives advertisers more signal while giving them less access to the person behind the signal.

Here is the part nobody predicted. While Facebook hemorrhaged billions, Apple's own advertising business quietly grew. Reports showed Apple Search Ads gaining adoption among the same advertisers abandoning Facebook. Apple built the privacy wall, then sold premium real estate inside it.

Facebook's agents still run. The SDK still ships in hundreds of thousands of apps. But where they once had perfect memory — your identity, your history, your predicted behavior — they now operate in the dark. They can guess. They can't know. The old system was agents with unrestricted memory, sharing everything with anyone. The new system is agents with defined skills, verified identities, crowd-anonymous memories, and time-limited tasks. Apple didn't destroy advertising. They forced it to grow up.

References: [ATT](https://developer.apple.com/documentation/apptrackingtransparency), [SKAdNetwork](https://developer.apple.com/documentation/storekit/skadnetwork), [AdAttributionKit](https://developer.apple.com/documentation/adattributionkit), [Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
