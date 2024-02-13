---
title: Apple’s Journal App: A Foray Into AI, the Other Way Round
description: A reflection of our souls in code
date: '2024-02-13T04:04:49.862Z'
categories: []
keywords: []
slug: /apple-journal-app-a-foray-into-ai
---

Upon the announcement of Apple’s Journal app at WWDC 23, I found myself torn. Given the comparable functionality available within the [Shortcuts app for mood tracking journals](https://hachyderm.io/@chughanupam/111572011312067429), the introduction of a dedicated Journal app by Apple felt intriguing, and questions lingered.

The Journal app boasts integration with photos, location data, music, workouts, and Apple Podcasts, offering a multifaceted approach to journaling. However, initial impressions left me wondering whether it merely represents Apple's foray into prompt-driven writing minus the social features, or if it caters specifically to niche audiences like travel bloggers (notably, one of the initial prompts encouraged me to reflect on my recent trip to Vietnam). Or it’s here to Sherlock apps like DayOne!

Fast forward to day one (pun intended) of the rollout of the Journal app alongside iOS 17.2, it was clear as day that the app has a trivial functionality with a simplistic user interface. It wasn’t here to compete with established journaling apps. Interestingly, DayOne was among the first apps to integrate the Journal Suggestions API.

Below are some of the key features of the Journal app:

- While the app does not support voice-like notes for recording, it does allow users to incorporate microphone audio into their journal entries.

- Siri does not have access to private journals, and the app lacks support for Widgets or Shortcuts, rendering it pretty basic compared to other Apple OS apps. Excluding Journal from Shortcuts does make sense, as it isn’t meant to be yet another "automate-my-way-to-writing" by interfacing with all app data. Plus, as stated previously, Apple Notes has supported a Mood Journal shortcut for quite some time.

- Images can only be added at the top of a Journal entry. Moreover, there is no provision for hyperlinking text. However, the app does allow to create new journal entries from URLs in share sheet — like writing your personal response to a Safari URL.

- The app lacks social discovery features for sharing journals with peers, giving the impression that it’s strictly a personal diary. However, the Journal Suggestions feature utilizes Nearby People to suggest reflection prompts based on your interactions in your vicinity (opt-in by default), making a strong case that the Journal is more than just a writing app. It’s designed to help us reflect on moments and build a data corpus from them — like an AI diary.

Besides the aforementioned features, the standout feature is the Journal Suggestions API, which developers can integrate into their own apps. It’s worth noting that the Journal Suggestions API only offers prompt suggestions for integration into apps and not the other round in supporting third-party apps to provide their own data. This makes a lot of sense from a privacy standpoint as it makes it clear that the API is meant for first-party data only. What’s even more appealing about the Journal Suggestions is that while it uses Music, Workout activities, and more, it doesn’t integrate activity with the TV app. And, the absence of the Journal app on iPadOS and macOS makes me wonder about Apple's strategic intentions! Perhaps the goal of keeping it iPhone only is to track active user data that can be fine-tuned on a potential on-device Large Language Model Model (LLMs) in the future.

The Journal app seems geared towards promoting the use of the Journal Suggestions API, rather than the other way around. It also appears to be Apple's effort to enhance Siri and its integration across apps, prioritizing privacy and first-party data. While Apple has faced criticism for Siri's intelligence lag, similar to Google's AI challenges with advertisers, Apple's reluctance to transform Siri into a "Samantha" (as in the movie Her, 2013) might be tied to its App Store dynamics. The App Store, despite facing criticism for its monopoly, serves as a robust and profitable ecosystem for Apple. A more capable Siri could potentially disrupt the current status quo, rendering many apps obsolete.

Overall, the Journal Suggestions API suggests Apple's unique approach to personalized AI for users and the potential enhancement of Siri's capabilities. In contrast to Siri Suggestions, which recommend app-based actions, Journal Suggestions aim to prompt users on how to utilize the apps effectively (perhaps it’s the start towards the end of apps as we know them). Furthermore, while Siri Suggestions are automatically enabled for all apps, the Journal Suggestions API appears to be an experimental initiative designed to encourage voluntary participation from developers.

Apple is already moving towards on-device LLMs, thanks to its open-source multimodal LLM, Ferret, which provides context-aware responses to images. When coupled with first-party data through Journal Suggestions and a voice, it hints at the possibility of a full-blown Samantha, hopefully sometime in the future.

![Illustration by me](/assets/illustrations/apple-journal-app-ai.png)