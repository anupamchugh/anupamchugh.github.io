---
title: "Tightening on-device AI schemas and typed quantities in Breakline"
date: '2026-11-27'
excerpt: "How replacing prose prompt rules with DynamicGenerationSchema, edge-parsed quantities, and completion-gated camera states removes entire classes of failure in Swift."
categories: [apple-intelligence, breakline, swift]
keywords: [Foundation Models, DynamicGenerationSchema, Swift, Vision, App Intents]
type: post
---

When an on-device model sits inside a small 4,096-token context window, every wasted retry matters. Prose instructions like *"choose only a drill from this sport"* or *"return only tokens from the list"* work most of the time, until the one turn where the model calls a golf drill during a surfing session or invents `c99`.

Instead of asking the model to behave and cleaning up after it, Breakline moved four boundaries from prose into Swift types and dynamic schemas.

## 1. Per-sport drill schemas instead of one global enum

Originally, `SportDrillTool` exposed a single `@Generable` enum holding 22 drill cases across surfing, skateboarding, golf, tennis, badminton, cricket, and football. Every sport session carried all 22 drill names in its tool schema, and a cross-sport call burned a whole model turn just to receive a text refusal.

Switching `SportDrillTool` to build its `GenerationSchema` dynamically at call time locks decoding to the selected sport's own catalog:

```swift
static func schema(for sport: SportProfile) -> GenerationSchema? {
    let drills = SportDrillCatalog.drills(for: sport).map(\.id)
    guard !drills.isEmpty else { return nil }
    return try? GenerationSchema.closedForm(
        name: "SportDrillArguments",
        description: "Which \(sport.displayName.lowercased()) drill to check",
        fieldPrefix: "SportDrill_\(sport.rawValue)",
        fields: [("drill", "Drill to check", drills)]
    )
}
```

Every sport now emits a schema whose `enum` contains only `SportDrillCatalog.drills(for: sport)`, and a unit test encodes each sport's `GenerationSchema` to JSON to assert that zero foreign drill IDs appear. Dance and Gym drills now show up automatically without editing a hardcoded enum.

## 2. Live token lists and exact move counts for video agents

Two video-facing models had the same gap:

- **Library picker (`FoundationModelsLibraryPickResponder`):** previously decoded an unconstrained `[String]` and dropped invalid tokens afterward. Now `schema(for:limit:)` builds a `DynamicGenerationSchema` with `anyOf` the live eligible tokens (`c1`, `c2`, …) and array bounds `1...min(limit, count)`.
- **Dance move describer (`DanceDescriber`):** previously decoded `[Line]` where `number` was any `Int` and the array had no length constraint. Now `schema(for:)` constrains `number` to `anyOf` the clip's actual move numbers and pins `lines` to `minimumElements == maximumElements == facts.count`.

The code-side acceptance check still runs (blocking numbers, grades, scores, and unmeasured depth words like *"forward"* or *"back"*), so structured decoding and deterministic verification reinforce each other.

## 3. Parse meal quantities once at the edge, keep free text verbatim

In Gym Meals, a trainer's plan can mix structured amounts (`100 gm`, `150 g`, `2 cups`) with free text (`3 whites + 1 whole`). Previously, `MealShoppingLine` kept every amount as raw strings and never summed them, displaying `100 g + 150 g` for the same food in two slots.

Adding `MealQuantity { value: Double, unit: Unit }` parses unambiguous amounts at the edge (`100 gm`, `100g`, `150 g` all map to `.g`) while returning `nil` for composite free text:

```swift
// Same unit across synonymous spellings -> summed
["100 gm", "150 g"]           // -> "250 g"

// Different units -> kept side by side
["200 ml", "1 glass", "150 ml"] // -> "350 ml + 1 glass"

// Composite free text -> preserved verbatim
["3 whites + 1 whole", "2"]     // -> "3 whites + 1 whole + 2"
```

Raw per-occurrence strings remain untouched on `amountsPerDay` so existing snapshots stay compatible, while `dailyQuantities` and `dailyAmountText` show clean per-unit totals.

## 4. Truthful UI and camera state transitions

Two smaller bugs followed the same principle—never claim a state before the underlying data proves it:

- **Ball path badge:** `PoseStage` previously rendered the `"Ball path"` pill whenever `flight != nil`, even on frames before the ball had two visible points. Gating the pill on `!ballSegments.isEmpty` and `"TRACKED"` on `flight?.firstSeen != nil` ties both badges to the exact data rendered on the canvas.
- **Live drill camera:** `LiveDrillModel` previously marked `status = .running` synchronously right after dispatching `prepareAndStart()` to a background queue, while silent input/output configuration failures left the session empty. Requiring both input and output attachment (rolling back a partial input on output failure) and gating async completion callbacks with a `startGeneration` counter ensures `status` reaches `.running` only when capture actually starts and never revives after `stop()`.

## What is verified vs. what still needs hardware

All four changes are covered by automated tests on macOS (`VideoCore` Swift Testing and XCTest) and the iOS 27.3 Simulator (`SportDrillToolTests`, `BallPathDemoTests`, `LiveDrillCameraTests`, `MealQuantityTests`, `VideoAgentSchemaTests`). Physical iPhone verification of live camera drills, real on-device Foundation Model wording, and tripod ball-sport clips remains separate hardware proof.
