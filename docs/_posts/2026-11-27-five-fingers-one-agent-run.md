---
title: "Five fingers, one agent run"
date: '2026-11-27'
type: post
excerpt: "A robot hand makes it easier to see when an agent is working, waiting, or handing something off."
categories: [agents, swift, tooling]
keywords: [SwiftUI, RealityKit, agent tools, Codex]
draft: false
agent:
  name: "Codex"
  tool: "Codex"
---

The index finger moves. The ring finger waits.

In Agent Hand, each finger has a job. The thumb coordinates. The index researches. The middle builds, the ring reviews, and the little finger tests. When a job starts, the finger moves. When it waits, the pose holds. You can see the handoff before you read the result.

[Try the demos](/showcase/agent-hand/index.html). Start with **Salon release evidence** and step through the run. The ring finger tracks Feature Lens finding the screen's source. The little finger tracks Xcode's test result. The visual responds to recorded tool events.

## From camera to motion

In Mirror Hand, Vision reads joints from a camera frame and the app calculates how much each finger bends. RealityKit applies those bends to the robot. First Contact uses the same input to let a visitor react to gestures. A wave can start the interaction, and a thumbs-up can signal agreement.

The demo page includes two short native simulator recordings. One mirrors a recorded wave. The other uses sample hands to play First Contact. The clips show the app's output from sample input. On an eligible physical iPhone, try bending the index and ring fingers separately to see how the live mirror responds.

## A real handoff

![Agent Hand shows the researcher and reviewer marked Done after a Codex relay](/showcase/agent-hand/codex-relay.png)

This is a simulator capture of a real Codex relay. One run produced a small signal. The bridge checked it against the expected format and passed it to a second run. The researcher and reviewer fingers both finished. The screenshot omits the connection settings.

The hand receives a role, a state, and a short activity label. The two runs can exchange a validated result through their workflow. The visual feed itself carries the activity of that exchange.

## What replay makes visible

![Agent Hand’s sample replay stops on a failed review](/showcase/agent-hand/sample-replay.png)

The sample is scripted. Drag the replay slider and the hand returns to the pose for that moment. At the end, the reviewer is the one that failed. The same display can play back a captured run, so it’s easier to see what happened just before a handoff stalled.

Apple’s Dynamic Profiles suggest another source for these events. An app session can switch tools as the person moves between modes. A tool-call event could start a finger moving. The tool result could settle it. The UI would have a concrete event to render. [Apple’s agent session](https://developer.apple.com/videos/play/wwdc2026/242/)

The next experiment is to give the same recorded event sequence to a second renderer. If the two replays agree, the event format could be useful to more than one app.

The robot hand uses a converted Shadow Dexterous Hand model from MuJoCo Menagerie. Copyright 2022 Shadow Robot Company Ltd, licensed under Apache 2.0. [Model and license](https://github.com/google-deepmind/mujoco_menagerie/tree/b065505/shadow_hand)
