---
draft: false
title: "Facebook's agents still run. Apple keeps wiping their memory."
date: '2026-02-04T12:00:00.000Z'
categories: [privacy, mobile, adtech]
keywords: [att, idfa, skadnetwork, adattributionkit, universal-links, facebook, apple]
slug: /facebooks-agents-still-run-apple-keeps-wiping-their-memory
published: true
---

i wrote in 2020 that apple’s iOS 14 privacy popup would crush deep links used for ad tracking. facebook warned of 50% revenue drops. advertisers panicked.

four years later, we have the receipts.

meta projected a ~$10b headwind. deep links lost their tracking superpowers. but then apple did something unexpected: they rebuilt attribution measurement from the ground up—with privacy guardrails.

think of the old system as an agent with unrestricted memory. it could read everything about you, share it with anyone, and remember it forever. the new system is an agent with defined skills and boundaries. it can only do what it’s authorized to do.

the agent is the spy. the advertiser is the handler. apple didn’t fire the spy—they wiped its memory and put it on a leash.

## the reckoning

in february 2022, meta’s cfo dave wehner admitted: “we believe the impact of iOS overall is a headwind on our business in 2022. it’s on the order of $10 billion.”

the stock nosedived. facebook lost ~$200b in market cap in a single day.

early ATT data showed opt‑out rates above 90% in the u.s. the vast majority chose “ask app not to track.”

## how facebook’s sdk used to work (the abuse)

before iOS 14.5, any app with facebook’s sdk could grab your device’s advertising identifier without asking:

```swift
// the old way - no consent required
import AdSupport

let idfa = ASIdentifierManager.shared().advertisingIdentifier.uuidString
// returns: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"

// facebook sdk would then:
// 1. send this IDFA to facebook's servers
// 2. match it against your facebook profile
// 3. track every app you opened, every purchase you made
// 4. build a behavioral model to predict what you'd buy next
```

that IDFA was constant for your device. it followed you everywhere. facebook’s sdk existed in hundreds of thousands of apps across app stores. every one of them fed data back to the mothership.

in simpler words: facebook had planted agents everywhere, all reporting back everything you did.

## what apple killed

iOS 14.5 introduced app tracking transparency. now that same code requires permission:

```swift
// the new way - consent required
import AppTrackingTransparency
import AdSupport

ATTrackingManager.requestTrackingAuthorization { status in
    switch status {
    case .authorized:
        // user said yes (only ~20% do)
        let idfa = ASIdentifierManager.shared().advertisingIdentifier.uuidString
    case .denied, .restricted, .notDetermined:
        // user said no - IDFA returns all zeros
        // "00000000-0000-0000-0000-000000000000"
        break
    @unknown default:
        break
    }
}
```

when users decline, the IDFA returns all zeros. useless. facebook’s cross‑app surveillance network went dark.

the agent lost its memory access. it could still exist in those apps, but it couldn’t remember who you were.

## the privacy‑preserving alternative

apple didn’t just kill tracking. they built a replacement: SKAdNetwork, and later AdAttributionKit.

the key insight: advertisers don’t need to know who installed their app. they need to know that their ad worked.

```swift
// privacy-preserving attribution
import StoreKit

// when user engages with the app, update conversion value
// no user ID, no device ID, no IDFA
SKAdNetwork.updatePostbackConversionValue(
    42,
    coarseValue: .high,
    lockWindow: false
) { error in
    // apple sends anonymous postback to ad network
}
```

what gets sent to the advertiser:

```json
{
  "version": "4.0",
  "ad-network-id": "example123.skadnetwork",
  "source-identifier": "1234",
  "conversion-value": 42,
  "did-win": true
}
```

the advertiser learns: “someone who saw ad campaign 1234 installed our app and reached conversion level 42.”

they don’t learn: “john smith, age 34, who also uses instagram and ordered pizza last tuesday, installed the app.”

## crowd anonymity: memory that requires consensus

with SKAdNetwork 4.0, apple introduced postback tiers based on crowd size. AdAttributionKit inherits the same privacy model.

think of it like this: an agent can only share a memory if enough other agents have the same memory. individual experiences stay private. only patterns emerge.

- tier 3 (large crowd): full details — 4‑digit campaign id, exact conversion value, publisher app, country code
- tier 2 (medium crowd): partial details — 2‑4 digit campaign id, conversion value
- tier 1 (small crowd): minimal — 2‑digit campaign id, coarse value only
- tier 0 (tiny crowd): almost nothing — just that someone installed

if you’re the only person who clicked an ad and installed an app, the advertiser learns almost nothing. only when enough people take the same action does detailed data flow. and even then, it’s aggregate—never individual.

## the resurrection: universal links

at wwdc 2024, apple unveiled AdAttributionKit with a feature advertisers had begged for: re‑engagement.

for the first time since iOS 14, advertisers could measure campaigns for apps users already had installed. the mechanism? universal links.

old deep links could do anything. no verification. no consent. any app could claim any url, pass any data, track anything.

universal links require mutual verification.

1) website declares which apps can handle its urls
2) app declares which domains it handles
3) system verifies both sides before routing

the agent can only do what both parties agreed to. no rogue behavior. no unauthorized tracking.

## re‑engagement: deep links reborn

with AdAttributionKit, universal links power privacy‑preserving re‑engagement:

```swift
// privacy-preserving re-engagement
import AdAttributionKit

try await Postback.updateConversionValue(
    42,
    coarseConversionValue: .high,
    lockPostback: false
)
```

deep links work again. but they can’t identify you.

## wwdc 2025: more slots, same amnesia

apple keeps shipping privacy patches like it’s a live service game. wwdc 2025 dropped four AdAttributionKit buffs:

- overlapping conversions via conversion tags (no more overwrite)
- cooldown timer to prevent credit‑stealing between campaigns
- country codes, but only when cohorts cross anonymity thresholds
- sandbox testing in settings for developers

better measurement without better surveillance.

## what facebook lost (and can’t get back)

before iOS 14.5:
- access IDFA without consent
- track users across apps
- build individual behavioral profiles
- match app data to facebook profiles
- precise ad retargeting
- exact user‑level conversions

after iOS 14.5: none of the above for most users. the IDFA returns zeros. facebook rebuilt around probabilistic matching and aggregate modeling. they can guess. they can’t know.

the agent still runs. but its memory has been wiped.

## the irony

while facebook hemorrhaged billions, apple’s own advertising business quietly grew. reports suggested apple search ads gained adoption among advertisers while facebook’s share declined.

apple built the privacy wall, then sold premium real estate inside it.

## the loop closes

in 2020, i wrote that apple’s privacy popup would kill deep links used for tracking.

i was half right.

the tracking did die. but deep links evolved. universal links and AdAttributionKit rebuilt what advertisers lost, and with boundaries.

the old system: agents with unrestricted memory, sharing everything with anyone, tracking individuals across the entire ecosystem.

the new system: agents with defined skills, verified identities, crowd‑anonymous memories, and time‑limited tasks.

apple didn’t destroy advertising. they forced it to grow up.

references: [ATT](https://developer.apple.com/documentation/apptrackingtransparency), [SKAdNetwork](https://developer.apple.com/documentation/storekit/skadnetwork), [AdAttributionKit](https://developer.apple.com/documentation/adattributionkit), [Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
