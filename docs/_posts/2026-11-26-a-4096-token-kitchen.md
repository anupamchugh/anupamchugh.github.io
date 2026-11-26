---
title: "A 4,096-token kitchen"
date: '2026-11-26'
excerpt: "A trainer's meal plan, a shopping list, and what a small on-device context window teaches me about designing an assistant."
categories: [apple-intelligence, breakline, agents]
keywords: [foundation-models, meal-planning, swift, context-window]
type: post
---

A trainer sends a meal plan. You want to know what's next, take a picture of your plate, and work out what to buy for the week. These are related tasks, but they don't need the same information.

That's the idea behind the meals work in Breakline. The plan reader needs the plan. A plate check needs the relevant meal and the picture. A shopping-list assistant needs the ingredients and the change you asked for. Each task gets a smaller job than “understand my entire life.”

[Try the sample walkthrough](/showcase/#meal-demo). It's a scripted illustration with invented data, not a live model session or a Swiggy connection.

## The window fills up

Apple documents a 4,096-token context window for its on-device foundation model. Instructions, prompts, tool definitions and replies, output schemas, and the model's answers all count. A token isn't a word: depending on the language, it may be part of one. Apple also exposes ways to count tokens and inspect the model's supported context size. [Apple's context-window guide](https://developer.apple.com/documentation/foundationmodels/managing-the-context-window) explains the details.

The interesting design question is what to leave out. If I ask “What is my next meal?”, a list of every workout isn't useful. If I ask to swap an ingredient, the assistant needs the shopping list and a way to make a bounded edit. It doesn't need to decide what to buy on its own.

Breakline's development work explores these separate tasks. The shopping-list tools can read the list and propose an edit; code handles the edit. An experimental Instamart flow was also explored. Read-only account, product and cart calls were exercised during development, but production approval and a complete order have not been verified. The sample walkthrough doesn't connect to Swiggy.

## A smaller job, not a smaller ambition

The context limit is a useful constraint. It encourages an app to retrieve relevant facts, ask for a specific result, and keep the person's decision visible. Apple also describes how stable instructions and tool definitions can help a session reuse previously processed context through [KV caching](https://developer.apple.com/documentation/foundationmodels/optimizing-key-value-caching-in-language-model-sessions). That can reduce repeated work; whether it helps a particular feature is something to measure.

I want to profile the real flows next: tokens, response time, and, most of all, whether the result is useful. A smaller prompt is only a win if the assistant still has the information it needs.
