---
layout: post
title: "Ten Years of Doing Stuff: From $2 Apps to Algorithmic Trading"
date: 2026-03-14
categories: [career, reflection]
tags: [indie-dev, ios, trading, career, open-source]
---

*First published in February 2024. Expanded and updated for this blog.*

I picked engineering because my family wanted me to. I wanted to make films, play cricket professionally, compete in chess and table tennis tournaments. Instead, I got a B.Tech in Computer Science from BITS Pilani (2011-2015) with a CGPA that told you exactly how much attention I was paying.

But reluctant engineers have one advantage: when they finally find problems worth solving, they don't approach them like everyone else.

## The $2 Lesson (2015)

I graduated without a job. Turned down a PPO from Syniverse during placement season because I was convinced I'd build something better. Classic.

My first app was a movie review RSS feed reader. Lifetime earnings: $2. The minimum payout threshold was $100. My second was a Harry Potter Unity lesson with graphics that looked like they were drawn during a turbulent flight. I never returned to it. Both eventually vanished from the Play Store.

<div class="image-grid">
  <img src="/screenshots/career-journey/movie-reviews-app.png" alt="Movie Reviews app" />
  <img src="/screenshots/career-journey/gimics-app.png" alt="Gimics game" />
  <figcaption>The last remaining screenshots of Movie Reviews and Gimics. For the archives.</figcaption>
</div>

**What I learned:** Shipping is easy. Shipping something people want is the actual job.

## The 30-Day Challenge (2015-2016)

After a costly DigitalOcean billing mistake, my father gave me an ultimatum: earn money online within 30 days or find a real job.

The thirty-day ultimatum got my balls rolling. I bid day and night at rates low enough to win against everyone. A few clients came through. I built a geolocation messaging app and started writing tutorials for JournalDev.com.

Over three years, I wrote **350+ Android tutorials**. The JournalDev Android app crossed 10,000 downloads. Writing started as learn-and-earn work for clients. It became an identity when I found a way to offload my chaotic thoughts and streamline them.

![JournalDev app on the Play Store](/screenshots/career-journey/journaldev-playstore.png)
*The JournalDev app on the Play Store. For the archives.*

## Dourier (2016)

Before joining a startup, I wanted to build one to see how it breaks. Dourier was a courier and print delivery service I built with a few friends -- purely to get my hands dirty with a real product. We shipped it, learned what we needed to learn, and let it go. Not everything has to become a company. Sometimes a project's job is just to teach you how to build one.

## MOBEY (2016-2017)

An Australian startup originally called MUBER hired me to build their delivery app. A week before launch, an official legal notice arrived from Uber about the name. I spent the next few days refactoring the entire Android codebase -- every string, every asset, every reference -- to rebrand as MOBEY.

I was the lead Android developer, working alongside Nishant on iOS. We shipped an app without onboarding -- nobody stopped us. My manager suggested "Here Comes The Money" as the notification ringtone for drivers when a new rider request came in. When it appeared in the YouTube video, the entire team rofl'd.

[The MOBEY notification video](https://www.youtube.com/watch?v=-VCwMGz0Zvw)

The company shut down in August 2017. But I'd learned what it felt like to own a product end-to-end -- from architecture decisions to last-minute rebrands to the sound a driver hears when an order lands.

## Aged Care Decisions (2017-2018)

A freelance contract with a Gold Coast company led to one of my more interesting projects: building server-driven iOS and Android apps for [Aged Care Decisions](https://agedcaredecisions.com.au), Australia's largest aged care placement service. The architecture was white-labelled -- one codebase, multiple vendor apps deployed from the same platform. It was my first exposure to shipping apps at scale for a non-tech industry, and to the discipline of building systems that other businesses depend on.

## Agricx and the iOS Pivot (2018-2019)

My JournalDev presence led to Agricx, an agri-tech startup using computer vision for crop quality assessment. I managed their Android team and coordinated across the ML and web teams -- part developer, part orchestrator, bridging the gap between mobile and AI. The work involved integrating OpenCV and ArUco marker detection into the mobile pipeline.

More importantly, I taught myself iOS development here and shipped their first enterprise iPad app solo. That single decision reshaped my career. I went from Android developer to mobile developer to, eventually, a SwiftUI early adopter who'd go on to write some of the framework's most-read tutorials.

Agricx shut down during COVID.

## Writing That Reached Millions (2019-2021)

The ML/AI knowledge from Agricx, combined with early SwiftUI expertise, led me to write regularly on Medium. A few pieces broke through:

- **"Apple Is Killing a Billion Dollar Industry"** -- 500K+ views, front page of Hacker News
- **"If Programming Languages Had Honest Slogans"** -- 150K views
- **"Ugly Truths About Working From Home"** -- 120K views, written months before the world found out for themselves

Multiple articles hit the Hacker News front page. The satirical pieces traveled furthest.

![Articles on the Hacker News front page](/screenshots/career-journey/hacker-news-frontpage.png)

The writing eventually split into three Substacks, each covering a different voice:

- [**iOSDevie**](https://iosdevie.substack.com) -- SwiftUI, CoreML, Vision, ARKit tutorials. The technical stuff: how to build things with Apple's frameworks, explained step by step
- [**Big Tech**](https://thebigtech.substack.com) -- Thoughts on technology and privacy. How Apple and Google's privacy moves reshaped Facebook's ad empire, and what that means for the rest of us
- [**Humor Bytes**](https://humorbytes.substack.com) -- My stabs at tech satire. "If Apps Were People You Knew," "10 Films That Clearly Influenced ChatGPT" -- the kind of writing where you take something developers live with daily and hold it at a slightly absurd angle

Three newsletters, three modes of thinking: teach, analyze, laugh. It turns out humor travels fastest, but the tutorials built the deepest trust.

### Open Source

Alongside the writing, I built open-source iOS projects that became reference material for the community:

- [**iowncode**](https://github.com/anupamchugh/iowncode) (900+ stars) -- A curated collection of iOS, ML, and AR projects: on-device CoreML classifiers (cat vs. dog, emoji detection), SwiftUI Tinder swipe cards, Vision credit card scanning, PencilKit + MapKit experiments
- [**iOS14VisionHandPose**](https://github.com/anupamchugh/iOS14VisionHandPose) -- A Tinder-style card stack controlled entirely by hand gestures. Thumbs up to swipe right. No touching the screen
- [**VisionCreditScan**](https://github.com/anupamchugh/VisionCreditScan) -- Real-time credit card scanning using Vision framework's rectangle detection and OCR

These weren't portfolio projects. They started as questions -- "can I make an app that swipes Tinder cards with hand gestures?" -- and ended up as something others could learn from.

## Better Programming (2020-2023)

![Better Programming](/screenshots/career-journey/better-programming-logo.png)

In 2020, [Zack Shapiro](https://twitter.com/ZackShapiro) invited me to manage [Better Programming](https://betterprogramming.pub), one of Medium's largest tech publications, while he was on paternity leave. I filled in, and then stayed. [Tony Stubblebine](https://twitter.com/tonystubblebine), who later became CEO of Medium, offered me the full-time managing editor role.

What followed was a three-year crash course in the creator economy -- from the inside. I wasn't just writing anymore. I was curating, moderating, recruiting writers, running newsletters, debugging the relationship between content and distribution. Better Programming was a good sprint. It also showed me how Medium turned writers into contestants in a rat race to churn, be accepted, and stay approved.

I started [**Coffee Bytes**](https://medium.com/@coffee_bytes), a newsletter designed to cheerlead for developer writers -- spotlighting their work, driving readers their way, building a community around the craft. It worked, for a while. But Medium's content factory system rewarded volume over curation, and the model I'd built couldn't survive the incentive structure it sat inside.

The publication scaled from 50 million to 150 million lifetime pageviews during my time. Monthly views peaked near 6 million.

![Medium stats](/screenshots/career-journey/medium-stats.png)
*That mandatory screenshot of my Medium stats.*

But the real education was watching the machine from behind the curtain. I learned how platform algorithms decide what surfaces and what gets buried -- and how little of it correlates with quality. I saw how the creator economy pulls you in: you start as a writer, become a curator, then a moderator, then suddenly you're spending more time managing the platform's incentives than doing the work that brought you there.

I resigned in September 2023. Medium had pivoted away from tech -- the acquisition spree under new leadership shifted focus, and Better Programming was placed on hiatus.

**The real lesson wasn't about Medium.** It was about platform dependency. When JournalDev was acquired by DigitalOcean, the publishing dates on my old Android posts changed from 2015 to 2023. Then I started getting spam LinkedIn messages asking me to update articles I could no longer edit. When Better Programming paused, years of curation went with it. This is why I now publish on my own site first and syndicate elsewhere. You're reading this on my blog for a reason.

## The New Chapter (2024-2026)

After Better Programming, I took time off. Traveled through Vietnam. Read voraciously. Watched more films than I'd like to admit. Picked up a camera -- or rather, kept using the one in my pocket.

![A street dog on a misty Kodaikanal forest trail](/photographs/career-journey/misty-dog-kodaikanal.jpg)
*Kodaikanal, 2022. iPhone SE. Sometimes the best photos find you on a morning hike.*

Then I started building again -- differently this time.

### Algorithmic Trading

I spent time building trading tools for myself. No grand reveal here. It taught me more about systems, risk, and the difference between automation and trust than I expected.

### Find Common Ground

A question I kept asking friends: "Where should we eat?" Not "what's rated highest on Google Maps" but "where do *we* actually overlap?" Every group dinner started with twenty minutes of negotiation. I wanted to skip straight to the answer.

[**Find Common Ground**](https://apps.apple.com/us/app/find-common-ground/id6759101340) is an iOS app that started as a place-matching experiment and kept growing. SwiftUI, SwiftData, MapKit, CloudKit, Multipeer Connectivity -- I kept finding excuses to wire in more frameworks. It now does route planning with timed timelines, trip journals with photo export, nearby discovery via MapKit search, and an async "vibe check" feature where two people react to each other's planned routes over CloudKit. The matching algorithm was the fun part; getting two people to actually complete any flow was the hard part. The one thing I got right: every shared route is a link that only opens in the app -- so the product spreads every time someone plans a Saturday with a friend.

<div class="image-grid">
  <img src="/screenshots/career-journey/common-ground-welcome.png" alt="Common Ground Welcome" />
  <img src="/screenshots/career-journey/common-ground-match.png" alt="Common Ground Match Results" />
</div>

On the [App Store](https://apps.apple.com/us/app/find-common-ground/id6759101340) now.

### Playlist Hunter

I kept describing playlists to friends in vibes -- "late night drive through the city," "Sunday morning coffee" -- and then spending thirty minutes manually searching for songs. So I built an app that takes the vibe and does the rest.

**[Playlist Hunter](https://apps.apple.com/in/app/playlist-hunter/id6756028972)** uses AI to generate Apple Music playlists from a text prompt. Room Mode lets multiple people contribute to the same playlist -- useful when everyone in the room has opinions about the aux.

<div class="image-grid">
  <img src="/screenshots/career-journey/playlist-hunter-login.png" alt="Playlist Hunter" />
  <img src="/screenshots/career-journey/playlist-hunter-ai.png" alt="Playlist Hunter AI" />
</div>

### Shadowbook

[**Shadowbook**](https://github.com/anupamchugh/shadowbook) is a CLI tool I built in Go for managing projects where multiple AI agents work on the same codebase. It tracks drift -- when specs change but code doesn't follow, when AI agents repeat mistakes, when comments rot while code evolves.

A project management tool for the era where your team includes three AI agents and yourself.

## What I've Learned

Most of it is obvious in hindsight.

I spent years building on platforms that eventually changed the rules or disappeared. JournalDev got acquired, 350 articles gone overnight. Better Programming went on hiatus. Medium shifted focus. Every time, the work survived only if I'd kept a copy. The lesson took three rounds to stick: if you don't own the ground, you're just decorating someone else's house.

I also learned that the things I built out of curiosity taught me more than the things I built for a paycheck. Nobody asked me to make an app that swipes Tinder cards with hand gestures. Nobody needed a restaurant-matching app for indecisive friend groups. But those projects forced me into corners of the SDK I'd never have found otherwise, and the solutions I improvised there showed up later in real work.

The filmmaking thing turned out to matter. I think about user flows the way I used to think about scenes -- setup, tension, payoff. My parents spent years worrying I was spread too thin. Turns out the scattered interests weren't a liability. They were the curriculum.

And the biggest one: I build random things until something becomes useful.
