---
draft: false
title: "Facebook's agents still run. Apple keeps wiping their memory."
date: '2026-02-04T12:00:00.000Z'
categories: [privacy, mobile, adtech]
keywords: [att, idfa, skadnetwork, adattributionkit, universal-links, facebook, apple]
slug: /facebooks-agents-still-run-apple-keeps-wiping-their-memory
published: true
---

Summary: Facebook's ad SDKs are still embedded everywhere, but Apple stripped the memory that made them powerful. The agents still run. The tracking doesn't.

## The old agent

Before iOS 14.5, the Facebook SDK could read the IDFA without asking. That identifier was stable, cross-app, and rich enough to stitch a user model across your phone.

```swift
// the old way - no consent required
import AdSupport

let idfa = ASIdentifierManager.shared().advertisingIdentifier.uuidString
// constant per device
```

That was an agent with full memory access. It could see you across apps, build a profile, and report everything back to the handler.

## The memory wipe

App Tracking Transparency (ATT) moved IDFA access behind explicit permission. If a user says no, the IDFA becomes all zeros.

```swift
// the new way - consent required
import AppTrackingTransparency
import AdSupport

ATTrackingManager.requestTrackingAuthorization { status in
    switch status {
    case .authorized:
        let idfa = ASIdentifierManager.shared().advertisingIdentifier.uuidString
    case .denied, .restricted, .notDetermined:
        // IDFA is all zeros
        break
    @unknown default:
        break
    }
}
```

The SDK can still run, but it can't remember who you are. That's the whole shift: the agent stays, the memory goes.

## The replacement: aggregate memory only

Apple didn't kill attribution. It rebuilt it. SKAdNetwork and AdAttributionKit let advertisers measure whether ads work without revealing who installed or re-opened an app.

```swift
// privacy-preserving attribution
import StoreKit

SKAdNetwork.updatePostbackConversionValue(
    42,
    coarseValue: .high,
    lockWindow: false
) { _ in
    // apple sends an anonymous postback
}
```

What an advertiser gets back is aggregate, not personal:

```json
{
  "version": "4.0",
  "ad-network-id": "example123.skadnetwork",
  "source-identifier": "1234",
  "conversion-value": 42,
  "did-win": true
}
```

No device ID. No user ID. No cross-app identity.

## Re-engagement without surveillance

Universal Links gave Apple a way to bring deep links back without turning them into tracking beacons.

- The website declares which apps can handle its links.
- The app declares which domains it can open.
- The system verifies both sides before routing.

That handshake is the guardrail. Deep links work again, but they can't smuggle identity data across apps.

## What Facebook lost (and can't get back)

- Stable cross-app identifiers for most users
- User-level conversion measurement
- Precise retargeting based on app-by-app behavior

What they still have is scale, modeling, and probability. The agent still runs. The memory is gone.

## The punchline

If you squint, this is Apple's pattern for all modern privacy: keep the agent, delete the memory, and fence the skills. Ads can still exist. Surveillance can't.

**Old agents hoarded memory. New agents run on constraints.**

References: [ATT](https://developer.apple.com/documentation/apptrackingtransparency), [SKAdNetwork](https://developer.apple.com/documentation/storekit/skadnetwork), [AdAttributionKit](https://developer.apple.com/documentation/adattributionkit), [Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
