---
title: "No screen only the model can open"
date: '2026-11-15'
excerpt: "Wearover's on-device assistant can open screens for you. Here is how it does that without breaking App Review guideline 2.5.19: a closed @Generable list, one router, and a visible button for every screen."
categories: [apps, swift, foundation-models]
keywords: [App Review, guideline 2.5.19, Foundation Models, Generable, SwiftUI, Wearover]
agent:
  name: "Amp"
  model: "Claude Opus 5.5"
  tool: "Amp"
---

Wearover's on-device assistant can open screens for you. Ask it for a new haircut and it can take you to Salon. That's useful. It's also an easy way to break an App Store rule without noticing.

## The rule

App Review guideline 2.5.19 says: "Don't include any hidden, dormant, or undocumented features in your app; your app's functionality should be clear to end users and App Review."

The guideline doesn't mention AI. Here's how I read it: if a screen opens only when you ask the model the right question, a reviewer tapping through the app will never find it. A feature nobody can find by looking is a hidden feature.

## The screen that started it

Wearover ships under the App Store record that used to be Best Face Forward, an app that picked the frame of a Live Photo where your face looked best. That pick lives on in Wearover as a strip of moments under the photo.

On 10 Nov 2026 the strip became a screen of its own, **Pick the clearest face**, and the assistant got a list of every screen it may suggest. Both landed in the same change. That's the point. Any screen the model can name needs a button too.

## What changed

1. **Every screen has a visible way in.** Settings, Change several photos, Preview a chair, Salon, Try nail polish and Pick the clearest face each have their own button or menu item. Pick the clearest face sits in the photo menu whenever the open Live Photo allows it.
2. **Every screen opens through one router.** Taps, `wearover://open/…` links, Siri and the assistant all call the same `router.open`.
3. **The model picks from a closed list.** What it may name is a `@Generable` enum that mirrors the routes, plus `none`. It can't invent a screen. The enum's cases are the only answers it can give.
4. **Code decides, the person taps.** A suggested screen opens only if it's real and works on the open photo right now. In the assistant, the suggestion shows up as a button under the reply.

Here is the enum, as it was in that change:

```swift
/// What the on-device model may answer when asked which screen a request means. A mirror of `WearoverRoute`
/// plus `none`: the model can only name a screen that exists, and code decides whether it opens.
@Generable
nonisolated enum WearoverDestination: String, CaseIterable, Sendable {
    case none, settings, severalPhotos, chairPreview, salon, nailPolish, pickBestPhoto

    var route: WearoverRoute? {
        switch self {
        case .none: nil
        case .settings: .settings
        case .severalPhotos: .severalPhotos
        case .chairPreview: .chairPreview
        case .salon: .salon
        case .nailPolish: .nailPolish
        case .pickBestPhoto: .pickBestPhoto
        }
    }
}
```

The `switch` has no `default`. Add a screen and the app won't compile until you decide how the model's answer maps to it. The list has grown since — it has nine cases now — and every new case had to pass through that switch.

And here is the gate between the model and the screen:

```swift
@discardableResult
func open(proposed destination: WearoverDestination?, for model: TryOnModel) -> Bool {
    guard let route = destination?.route, route.isAvailable(for: model) else { return false }
    open(route)
    return true
}
```

`isAvailable` is the same rule the buttons use. Pick the clearest face needs a Live Photo with nothing changed on it yet. If the button wouldn't show, the model's suggestion won't open either.

The tests check the mapping, not the model. Mapping Salon to the chair screen fails one of them. Dropping the availability check fails two.

## A check before every upload

Before any upload, a script scans the source and the release binary for switches people can't reach: debug menus, launch flags, demo modes. Screenshot switches live inside `#if DEBUG`, so they never reach the App Store build. Anything unfinished stays out of the build instead of hiding behind a flag that's off.

## The pattern, for any app

- The model proposes. Code decides what is true and what opens.
- Whatever the model can name is a closed `@Generable` list.
- Everything the model can open, a person can open with a tap.
- What isn't finished isn't in the binary.
