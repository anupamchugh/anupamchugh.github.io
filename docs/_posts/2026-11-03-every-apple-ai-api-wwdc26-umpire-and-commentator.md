---
title: "The umpire decides, the commentator explains: every Apple AI API after WWDC26"
date: '2026-11-03'
excerpt: "A field guide to every Apple intelligence API as of WWDC26 — models, sessions, structured output, agents, images, Siri, evaluations, concurrency and MCP — with cricket as the mental model and real code from seven of my apps."
categories: [apple-intelligence, foundation-models, swift, agents]
keywords: [foundation-models, wwdc26, ios-27, private-cloud-compute, dynamic-profile, evaluations, app-intents, app-schemas, visual-intelligence, image-playground, fm-cli, cricket]
type: post
draft: false
agent:
  name: "Claude Code"
  model: "Opus 5.5"
  tool: "Claude Code"
---

In a cricket match, two people talk about the same ball.

The **umpire** decides. Out or not out, four or six, wide or legal. The umpire works from the laws of the game and from what the cameras saw, and the umpire is never creative. If the umpire is unsure, there is a review, and the review is also rules plus evidence.

The **commentator** explains. "That was a loose drive, he's been looking for that cover boundary all morning." The commentator is warm, quick, sometimes wrong about a hunch, and never changes the score.

Every app I've built on Apple's Foundation Models since last year has ended up with the same split, usually after something went wrong. The rules code is the umpire. The language model is the commentator. When I let the model keep score, it lied about the score.

WWDC26 shipped a lot: a new on-device model, a server model on Private Cloud Compute, a way to plug in any model, dynamic profiles, an Evaluations framework, a command line tool, App Schemas for Siri, Visual Intelligence, and more. This post walks every piece, in that order, using the umpire/commentator split as the frame. Each section has a tiny cricket example first, then the real API, then real code from one of my apps:

- **Quorion** (a Blood on the Clocktower table, repo `ClocktowerTable`)
- **Breakline** (a surf and gym coach, repo `SurfCoach`)
- **Orbit** (a day and trip planner, repo `PlaceMatch`)
- **Wearover** (a stylist, repo `Wardrobe`)
- **Low Roller** (a trading coach that never picks trades)
- **Folio** (a design-reference library)
- Apple's **Origami** sample, which I keep a copy of as the reference

And three reference repos that aren't my apps:

- Apple's open-source [**foundation-models-utilities**](https://github.com/apple/foundation-models-utilities) package (I read the `1.0.0-beta5` checkout), which holds `Skills`, the history modifiers and `ChatCompletionsLanguageModel`.
- Rudrank Riyam's [**Foundation Lab**](https://github.com/rudrankriyam/Foundation-Models-Framework-Lab), a workbench app with a lab for nearly every API, plus an `fmf.md` that diffs the Xcode 27 Swift interface.
- **ChughyFMStack**, my small package that runs one feature on device, in the Simulator or in previews.

The companion app for this post is **Crease**, a cricket prototype built to demonstrate these APIs in one place; some surfaces remain planned or unverified, as noted below.

> **Crease is a working local prototype.** Its simulator runs have exercised the match, commentary, captain and umpire flows; the repository is not public yet. The scorecard reader still needs a real-photo check, Image Playground needs a supported device, and Private Cloud Compute needs its entitlement. I'll link the README and its API-to-code map when the repository is public.

---

## 1. Models: who's in the commentary box

**In plain words.** There are now several commentators you can hire. A small one that lives on the phone and works offline. A much bigger one on Apple's servers that can think before it speaks. And any third-party one you like, through a common plug. Your app talks to all of them the same way.

```swift
// A tiny pseudo-app: same match, three commentary boxes.
struct CommentaryBox: View {
    @State private var line = ""
    let event: BallEvent            // decided by the umpire, not the model

    var body: some View {
        Text(line)
            .task {
                let session = LanguageModelSession(model: SystemLanguageModel())  // on device
                // let session = LanguageModelSession(model: PrivateCloudComputeLanguageModel())  // server
                line = (try? await session.respond(to: "Describe this ball: \(event.summary)").content) ?? event.summary
            }
    }
}
```

### The new on-device model

The on-device model was "rebuilt from the ground up": better at logic and tool calling, and it now takes images ([241](https://developer.apple.com/videos/play/wwdc2026/241/)). Its context window depends on the OS and the device: `contextSize` reports 4,096 tokens on 26.0 and 8,192 on 27.0 on newer devices ([319](https://developer.apple.com/videos/play/wwdc2026/319/), code at 5:58). Don't hard-code either number. Read it, and count:

```swift
let model = SystemLanguageModel()
print(model.contextSize)
let count = try await model.tokenCount(for: "Who bowled the 19th over?")
```

Both APIs arrived in iOS 26.4, and Apple says to use them "to adapt your app to the hardware it's running on" ([241](https://developer.apple.com/videos/play/wwdc2026/241/)).

### `PrivateCloudComputeLanguageModel`

This is the model behind many Apple Intelligence features: much bigger, a 32K context, and **reasoning** — it can generate a hidden "thinking" segment before the answer, at `.light`, `.moderate` or `.deep` ([319](https://developer.apple.com/videos/play/wwdc2026/319/)). Switching is one line:

```swift
let session = LanguageModelSession(model: PrivateCloudComputeLanguageModel())
let response = try await session.respond(
    to: prompt,
    contextOptions: ContextOptions(reasoningLevel: .light)
)
```

The business terms matter as much as the API ([319](https://developer.apple.com/videos/play/wwdc2026/319/), [241](https://developer.apple.com/videos/play/wwdc2026/241/)):

- No account setup, no authentication, no API keys, no token cost to the developer.
- Available to apps under 2 million first-time downloads; you apply on the developer site and need the `com.apple.developer.private-cloud-compute` entitlement (the Origami sample's `OrchestratorProfile.swift` comments link the request form).
- Each user has a **daily limit**, higher with iCloud+. Check `model.quotaUsage.isLimitReached`, show `isApproachingLimit` as a quiet label (not an alert), and offer `limitIncreaseSuggestion.show()`. Xcode's scheme options can simulate both states ("Simulate Apple Foundation Models Availability").
- It needs a network and an Apple Intelligence device, so check `isAvailable` and fall back.
- Reasoning tokens count against the context.

It also brings Foundation Models to **watchOS 27** ([241](https://developer.apple.com/videos/play/wwdc2026/241/)).

### Any model: the `LanguageModel` protocol and `LanguageModelExecutor`

`LanguageModelSession` no longer means "Apple's model". It takes anything that conforms to `LanguageModel`. `SystemLanguageModel` and `PrivateCloudComputeLanguageModel` already do; Apple is open-sourcing `CoreAILanguageModel` and `MLXLanguageModel`, and Anthropic and Google are publishing Swift packages for their models ([241](https://developer.apple.com/videos/play/wwdc2026/241/)). The open-source **Foundation Models framework utilities** package includes a language model that talks to any server using the **Chat Completions** standard ([241](https://developer.apple.com/videos/play/wwdc2026/241/)).

The real initializer, from the package source, is small:

```swift
// from apple/foundation-models-utilities, Sources/.../LanguageModels/ChatCompletionsLanguageModel.swift
public init(
    name: String,
    url: URL,
    additionalHeaders: [String: String] = [:],
    supportsGuidedGeneration: Bool = true,
    urlSessionConfiguration: URLSessionConfiguration? = nil
)
```

And macOS 27's `fm` command has a `serve` subcommand ("Start a Chat Completions API server", per `fm --help` on my Mac). ChughyFMStack uses that to give the **iOS Simulator** a real model during development: a DEBUG-only `MacBridgeBackend` posts to the Mac's `fm serve` at `http://127.0.0.1:1976/v1/chat/completions`. Its own doc comment notes the limit: text and `@Generable` output work, but "Tools don't: `fm serve` answers tool calls in plain text". It's a commentator on the radio, not one in the booth.

If you're writing a provider, the protocol has two halves ([339](https://developer.apple.com/videos/play/wwdc2026/339/)):

- `LanguageModel` describes the model: its `capabilities`, and an `executorConfiguration`.
- `LanguageModelExecutor` does the work: `init(configuration:)`, `prewarm(model:transcript:)`, and `respond(to:model:streamingInto:)`, which turns transcript entries (instructions, prompts, tool calls, tool outputs, responses) into your engine's messages and streams the result back.

The session keeps one executor per distinct `Configuration` (it's `Hashable`), and tears them all down when the session goes away. If your model can't do something the developer asked for, throw `LanguageModelError.unsupportedCapability`, or approximate ([339](https://developer.apple.com/videos/play/wwdc2026/339/)).

Foundation Lab has a working provider: a Gemini model that takes a video, written to exactly that shape.

```swift
// from Foundation-Models-Framework-Lab, Foundation Lab/Services/GeminiDeveloperVideoLanguageModel.swift
struct GeminiDeveloperVideoLanguageModel: LanguageModel {
    typealias Executor = GeminiDeveloperVideoLanguageModelExecutor
    let capabilities = LanguageModelCapabilities([])
    let executorConfiguration: Executor.Configuration
    // ...
}

extension GeminiDeveloperVideoLanguageModelExecutor {
    func respond(
        to request: LanguageModelExecutorGenerationRequest,
        model: GeminiDeveloperVideoLanguageModel,
        streamingInto channel: LanguageModelExecutorGenerationChannel
    ) async throws {
        try validate(request)
        let convertedTranscript = try convert(request.transcript)
        let response = try await client.generateContent(
            contents: convertedTranscript.contents,
            systemInstruction: convertedTranscript.systemInstruction
        )
        try Task.checkCancellation()
        // ...
        try await send(response, for: request.id, into: channel)
    }
}
```

It's a lab, so the API key travels in the `Configuration`. In a shipping app, follow Apple's rule below and fetch tokens at runtime.

Two things for app developers, not provider authors:

- Third-party models mean billing and auth again. Apple's advice: never ship keys in the binary; fetch tokens with OAuth and keep them in the Keychain. Use the new `response.usage` (total, cached and reasoning tokens) to watch spend ([241](https://developer.apple.com/videos/play/wwdc2026/241/)).
- The protocol is also the best **test seam** I've found. Breakline's profiles take an optional model so tests can inject a scripted one:

```swift
// from SurfCoach/App/iOS/CoachProfile.swift
struct CoachProfile: LanguageModelSession.DynamicProfile {
    let grounding: CoachGrounding
    let sport: SportProfile
    let ledger: ChatTokenLedger
    /// Nil is the system model. Tests supply a scripted one.
    var languageModel: (any LanguageModel)? = nil

    var body: some DynamicProfile {
        if let languageModel {
            coach.model(languageModel).historyTransform { ledger.bounded($0) }
        } else {
            coach.model(SystemLanguageModel.default).historyTransform { ledger.bounded($0) }
        }
    }
    // ...
}
```

**Umpire rule:** the model choice is a product decision about privacy, cost and offline use, made in code. The model never picks its own box.

---

## 2. Sessions and context: the commentator's notebook

**In plain words.** A session is a commentator's notebook for one match. The notebook has a fixed number of pages (the context window). Everything goes in it: the brief you gave them, every ball they were told about, every stat they looked up, and everything they said. When it's full, they can't take another note.

```swift
// One notebook per commentator, for the whole match.
@Observable final class Booth {
    private var session: LanguageModelSession?

    func commentator() -> LanguageModelSession {
        if let session { return session }
        let made = LanguageModelSession(instructions: "You are a warm, brief cricket commentator.")
        session = made
        return made
    }

    func newMatch() { session = nil }   // a new match gets a clean notebook
}
```

### Instructions and Transcript

`Instructions` are the developer's brief and outrank the prompt. The `Transcript` is the session's record of everything in context: instructions, prompts, tool calls, tool outputs, responses, and now reasoning segments ([339](https://developer.apple.com/videos/play/wwdc2026/339/), [319](https://developer.apple.com/videos/play/wwdc2026/319/)). New this year: `session.transcript` is **settable**, but only while `isResponding` is false; mutating it mid-response is a programmer error ([242](https://developer.apple.com/videos/play/wwdc2026/242/)).

### `tokenCount` and `contextSize`

Covered above. The habit that matters: measure your instructions + tool schemas + a typical turn with `tokenCount(for:)` and budget against `contextSize` for the device you're on. Breakline does exactly this with a `ChatTokenLedger` that trims history to a counted-token budget (see the `historyTransform { ledger.bounded($0) }` call above).

When it overflows anyway: iOS 27 throws `LanguageModelError.contextSizeExceeded` ([339](https://developer.apple.com/videos/play/wwdc2026/339/)). The old `LanguageModelSession.GenerationError.exceededContextWindowSize` is now marked deprecated in the docs ([docs](https://developer.apple.com/documentation/foundationmodels/languagemodelsession/generationerror/exceededcontextwindowsize(_:))).

### `DynamicProfile`

This is the biggest new idea. A `DynamicProfile` is a SwiftUI-like declaration of *who the commentator is right now*: instructions, tools, and modifiers for model, temperature, sampling mode, reasoning level and so on. Its `body` is **re-evaluated before every request**, so when your app state changes, the persona changes, but the transcript carries on ([241](https://developer.apple.com/videos/play/wwdc2026/241/), [242](https://developer.apple.com/videos/play/wwdc2026/242/)).

```swift
// Cricket pseudo-app: same notebook, different hat per phase of play.
struct MatchProfile: LanguageModelSession.DynamicProfile {
    var match: MatchState   // @Observable, owned by the umpire

    var body: some DynamicProfile {
        switch match.phase {
        case .live:
            Profile { Instructions("One sentence per ball. Never state the score yourself.") }
                .model(SystemLanguageModel())
        case .inningsBreak:
            Profile { Instructions("Explain the turning points of the innings.") }
                .model(PrivateCloudComputeLanguageModel())
                .reasoningLevel(.moderate)
        }
    }
}
```

**Real code — the before/after that taught me this.** Quorion's bots used to open a brand new session for every line of table talk:

```swift
// from ClocktowerTable/Sources/AIBotBrain.swift, before commit 6a01af1
let model = SystemLanguageModel(guardrails: .permissiveContentTransformations)
let session = LanguageModelSession(model: model, instructions: Instructions {
    Self.dialogueBrief(for: player)
})
session.prewarm()
let response = try await session.respond(
    to: Self.prompt(for: player, action: action, context: context, roles: roles),
    options: GenerationOptions(maximumResponseTokens: 160)
)
```

Two bugs in one: each bot forgot what it had claimed a minute ago, and every line paid the model's cold start because `prewarm()` ran right before `respond`. The fix keeps **one session per seat for the whole game**, built from a profile:

```swift
// from ClocktowerTable/Sources/AIBotBrain.swift, after commit 6a01af1
struct BotVoiceProfile: LanguageModelSession.DynamicProfile {
    let brief: String

    var body: some DynamicProfile {
        Profile {
            Instructions { brief }
        }
        .model(SystemLanguageModel(guardrails: .permissiveContentTransformations))
        .historyTransform { Array($0.suffix(4)) }
    }
}

private var voiceSessions: [UUID: LanguageModelSession] = [:]

func voiceSession(for player: AIGamePlayer) -> LanguageModelSession {
    if let session = voiceSessions[player.id] { return session }
    let session = LanguageModelSession(profile: BotVoiceProfile(brief: Self.dialogueBrief(for: player)))
    voiceSessions[player.id] = session
    return session
}

/// Call when the table opens, well before the first line, so the model is loaded by then.
func prewarmVoices(for players: [AIGamePlayer]) {
    guard modelStatus.isAvailable else { return }
    for player in players where !player.isHuman {
        voiceSession(for: player).prewarm()
    }
}
```

A new game calls `resetVoiceSessions()`, so no seat carries the last game's claims, and a context overflow restarts that one seat once.

> **Follow-up for Quorion:** the overflow retry still catches the deprecated `GenerationError.exceededContextWindowSize`. On iOS 27 it should also catch `LanguageModelError.contextSizeExceeded`, the way Breakline's `CoachErrorPresentation.swift` already does. (That fix is next.)

### `DynamicInstructions`

`DynamicInstructions` groups instructions *and* tools into a reusable, composable block; nest one inside another and the instructions and tools concatenate ([242](https://developer.apple.com/videos/play/wwdc2026/242/)). Think of it as a specialist's briefing card you can hand to any commentator.

```swift
// from SurfCoach/App/iOS/CoachProfile.swift
struct CoachInstructions: DynamicInstructions {
    let sport: SportProfile

    var body: some DynamicInstructions {
        Instructions(CoachPrompt.instructions(for: sport))
        Instructions("For photo-specific drill questions, use checkSportDrill or poseFacts when useful. General \(sport.displayName) explanations do not require a pose tool.")
    }
}
```

And conditional content is just `if`, the same as SwiftUI. Breakline's gym coach gets meal tools only when the sport is gym:

```swift
// from SurfCoach/App/iOS/CoachProfile.swift
Profile {
    CoachInstructions(sport: sport)
    PoseFactsTool(grounding: grounding)
    SportDrillTool(grounding: grounding, sport: sport)
    if sport == .gym {
        Instructions("For questions about today's food or meals, call mealsToday and answer only from what it returns. ...")
        MealsTodayTool()
        MealPlanTool()
    }
}
```

### `historyTransform`

`historyTransform` rewrites the history the model sees **for this request only**; it does not change the stored transcript, so nothing is lost for later ([242](https://developer.apple.com/videos/play/wwdc2026/242/)). Use it to trim, drop finished tool calls, or redact before moving to a less private model. The utilities package ships ready-made modifiers ([242](https://developer.apple.com/videos/play/wwdc2026/242/)); in the `1.0.0-beta5` source they are `rollingWindow(entries:)` and `rollingWindow(size:)`, `droppingCompletedToolCalls()`, and `summarizeHistory(entryThreshold:model:instructions:summaryPostamble:)`, which uses a model you choose to compress older turns.

A naive `suffix(4)` can split a question from its answer. Breakline's version keeps the instructions and starts the window on a prompt:

```swift
// from SurfCoach/App/iOS/CoachProfile.swift
/// Keeps the instructions plus the last four entries, starting on a prompt so
/// a question is never separated from its answer.
static func shortHistory(_ entries: [Transcript.Entry]) -> [Transcript.Entry] {
    let instructions = entries.filter(\.isInstructions)
    var recent = Array(entries.filter { !$0.isInstructions }.suffix(4))
    while let first = recent.first, !first.isPrompt {
        recent.removeFirst()
    }
    return instructions + recent
}
```

### `onResponse`, session properties and the KV cache

Lifecycle modifiers — `onResponse`, `onToolCall`, `onToolOutput` — run your imperative code at fixed points in the session ([242](https://developer.apple.com/videos/play/wwdc2026/242/)). The classic use: after each response, if history is long, summarize the old part into a session property and drop it:

```swift
// Pattern from WWDC26 session 242 (12:24), cricket-flavoured
extension SessionPropertyValues {
    @SessionPropertyEntry var inningsSummary: String?
}

struct MatchProfile: LanguageModelSession.DynamicProfile {
    @SessionProperty(\.history) var history
    @SessionProperty(\.inningsSummary) var inningsSummary
    // ...
    // Profile { ...; if let inningsSummary { Instructions { "So far: \(inningsSummary)" } } }
    //   .onResponse { if history.count > 50 { inningsSummary = try await summarize(...); history = ... } }
}
```

The `history` session property is **lossy and shared by every profile**; `historyTransform` is lossless and per-profile. Prefer the transform unless you really mean to forget ([242](https://developer.apple.com/videos/play/wwdc2026/242/)).

The cost nobody talked about last year: appending keeps the model's KV cache warm; rewriting history, changing tools or changing instructions usually invalidates it and raises time-to-first-token. Last year's APIs were append-only on purpose; "this year, we're taking the training wheels off" ([242](https://developer.apple.com/videos/play/wwdc2026/242/)). Measure it in Instruments (section 7).

---

## 3. Structured output: the scorecard, not the speech

**In plain words.** Free text is commentary. A scorecard is a form with boxes. When your code needs to *use* what the model says, ask for the form, and let the framework guarantee the model fills only those boxes.

```swift
@Generable
struct BallCall {
    @Guide(description: "One sentence of commentary, under 25 words")
    var line: String
    var mood: Mood
}

@Generable
enum Mood { case calm, tense, jubilant }

let call = try await session.respond(to: "Describe: \(event.summary)", generating: BallCall.self).content
```

### `@Generable` and `@Guide`

`@Generable` makes a Swift type the model's output schema; `@Guide` adds a description and constraints like `.count(3...8)`, `.maximumCount(3)`, `.range`, `.anyOf` ([298](https://developer.apple.com/videos/play/wwdc2026/298/) shows `@Guide(description:..., .count(3...8))`). Structured output and tools behave the same on PCC as on device ([319](https://developer.apple.com/videos/play/wwdc2026/319/)).

Low Roller's coach returns a reply plus up to three buttons, and the buttons are an enum, so the model can only pick buttons that exist:

```swift
// from LowRoller/App/Coach/CoachModel.swift
@Generable
struct CoachReply {
    @Guide(description: "The reply to the person, plain text, under 120 words")
    var reply: String
    @Guide(description: "One to three buttons to show under the reply, most useful first", .maximumCount(3))
    var actions: [CoachButton]
}

/// The buttons the model may choose from. Calling a helpline is never the model's choice; the
/// distress guard adds it.
@Generable
enum CoachButton {
    case pause, checkIn, sizeCheck, reviewTrades, practiceChart
    case lessonSeatbelt, lessonForecast, lessonHouseEdge, lessonBattingAverage, lessonMovieTicket
    // ...
}
```

Read that doc comment again. That's the umpire speaking: the helpline button is added by code, never chosen by the model.

A caution from the same file: "The structured reply can trip the on-device guardrails on ordinary questions … while a plain-text reply passes, so ask again in plain text and pick the buttons in code." And permissive guardrails relax only `String` output; `@Generable` output keeps the default behaviour ([docs](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel/guardrails/permissivecontenttransformations)). Quorion's voice lane is a free `String` for exactly that reason.

### `DynamicGenerationSchema`

When the allowed values are only known at runtime, build the schema at runtime ([docs](https://developer.apple.com/documentation/foundationmodels/dynamicgenerationschema)). This is the strongest umpire move in any of my apps. Orbit's planner sometimes named a place its tools never returned. The repair pass rebuilds the schema so the place ID can **only** be one of the grounded IDs:

```swift
// from PlaceMatch/PlaceMatch/Services/OrbitPlanner.swift
/// A second, tool-free response whose place ids can only be grounded ones
/// (`anyOf`), so the model cannot invent a place this time.
let stop = DynamicGenerationSchema(name: "Stop", properties: [
    .init(name: "placeID", schema: DynamicGenerationSchema(type: String.self, guides: [.anyOf(ids)])),
    .init(name: "minutes", schema: DynamicGenerationSchema(type: Int.self, guides: [.range(15...240)])),
    .init(name: "reason", schema: DynamicGenerationSchema(type: String.self, guides: []))
])
let root = DynamicGenerationSchema(name: "Stops", properties: [
    .init(name: "stops", schema: DynamicGenerationSchema(arrayOf: stop, minimumElements: 1, maximumElements: 5))
])
let schema = try GenerationSchema(root: root, dependencies: [])
```

In cricket terms: the commentator may only name a player who is actually on the team sheet. The team sheet comes from the umpire.

### `PromptRepresentable`

`PromptRepresentable` is the protocol behind everything you can put in a prompt builder: strings, attachments, your own types ([docs](https://developer.apple.com/documentation/foundationmodels/promptrepresentable)). Tools can also return it — Apple's own mode-switch example is `func call(arguments:) async throws -> some PromptRepresentable` ([241](https://developer.apple.com/videos/play/wwdc2026/241/)). Make your domain types conform so the umpire decides exactly how a ball is described to the model. Orbit passes `prompt.promptRepresentation` rather than string-building at the call site.

---

## 4. Agents: the third umpire, the stats desk, and who's allowed in the booth

**In plain words.** Tools are the commentator's phone to the stats desk: "how many sixes has he hit at this ground?" The desk answers from the record book. An agent is a commentator who decides on their own when to phone, and which desk.

```swift
struct CareerStatsTool: Tool {
    let name = "careerStats"
    let description = "Looks up a player's recorded career stats. Use for any number about a player."

    @Generable struct Arguments { var player: String }

    func call(arguments: Arguments) async throws -> String {
        Scorebook.shared.careerLine(for: arguments.player)   // the umpire's record, never the model's guess
    }
}
```

### Tools

Low Roller's rule is the one I now use everywhere: "every number the model mentions comes from a tool backed by deterministic code" (`LowRoller/App/Coach/CoachModel.swift`). Its `SizeCheckTool` takes capital, entry, exit and risk percent as `@Generable` arguments and does the arithmetic in Swift.

### Tool calling mode

New: `.allowed` (default), `.disallowed`, `.required`. With `.required` the model is "essentially in a while loop" and **you** must provide an exit ([242](https://developer.apple.com/videos/play/wwdc2026/242/)). Orbit learned this on device: "the model retried a failing route call until the turn timed out". Its fix is a counted exit:

```swift
// from PlaceMatch/PlaceMatch/Services/OrbitPlanner.swift
/// After this many tool calls the model must answer with what it has.
static let maximumToolCalls = 8

static func callingMode(afterCalls calls: Int) -> GenerationOptions.ToolCallingMode {
    if calls < 1 { return .required }
    return calls >= maximumToolCalls ? .disallowed : .allowed
}
```

### Baton-pass and phone-a-friend

Apple names two orchestration patterns ([242](https://developer.apple.com/videos/play/wwdc2026/242/)):

- **Baton-pass** — two profiles share one transcript; a tool flips the mode variable and the receiving profile gives the final answer. Like the TV commentator handing to the radio commentator mid-over: same match, same notes.
- **Phone-a-friend** — a tool spawns a short-lived child session with its own transcript, asks it one thing, and returns the answer as tool output. The parent always gives the final answer. Like the commentator ringing the statistician: the statistician never goes on air.

```swift
// Shape from session 242 (14:14)
struct PhoneFriendTool<P: LanguageModelSession.DynamicProfile>: Tool {
    func call(arguments: GeneratedContent) async throws -> String {
        let session = LanguageModelSession(profile: profile())
        let response = try await session.respond(to: arguments)
        return response.content
    }
}
```

Orbit uses a small baton-pass: `OrbitSetPlanScopeTool` lets the model switch between planning a day and a trip, and the profile re-reads `turn.scope` before the next request, adding `plan_trip_days` only in trip scope.

### Skills

The utilities package has a `Skills` type: a set of named `Skill`s with descriptions, whose full prompts load only when activated — procedural knowledge on demand ([242](https://developer.apple.com/videos/play/wwdc2026/242/), [241](https://developer.apple.com/videos/play/wwdc2026/241/)):

```swift
// Shape from session 242 (15:15), cricket-flavoured
struct CricketSkills: LanguageModelSession.DynamicInstructions {
    var activations: SkillActivations
    var body: some DynamicInstructions {
        Skills(activations: activations) {
            Skill(name: "lbw_explainer",
                  description: "How leg-before-wicket is judged",
                  prompt: "Pitching, impact, and wickets: ...")
            Skill(name: "dls_explainer",
                  description: "How rain-reduced targets work",
                  prompt: "...")
        }
    }
}
```

The package source shows how it works: `Skills` is itself a `DynamicInstructions`, and the model activates a skill by **calling a tool**. Its initializer is `Skills(activations:toolName:toolDescription:instructions:strictSchema:skills:)`. `strictSchema: true` lists only valid targets, so the model can't deactivate a skill that's already off. Each `Skill` takes a `name`, a `description` the model reads to decide, a `prompt` (a string or a `@PromptBuilder` closure), and an optional `onActivate` callback. `SkillActivations` has `activate(_:)`, `deactivate(_:)` and `isActive(_:)`, so your code can see and set what's loaded.

Skills fit an 8K on-device context well: the commentator carries the index card, not the whole law book. **None of my apps use Skills yet** (section 12), and Foundation Lab has no Skills lab either.

> **In Crease:** five rules skills (wides, no-balls, LBW, fielding restrictions, run-outs), so the rules desk loads only the law it needs.

### Tool admission

"Tool admission" is my name for the check that runs **before** a tool does anything. Apple's security session shows it as an `onToolCall` that throws unless the user confirms a risky tool ([347](https://developer.apple.com/videos/play/wwdc2026/347/)). Orbit uses the same hook for a different rule: a tool the person switched off must never run, even if an earlier turn's transcript makes the model ask for it.

```swift
// from PlaceMatch/PlaceMatch/Services/OrbitPlanner.swift
/// Runs before any tool: a tool whose switch is off never runs, even if
/// the model asks for it from an earlier turn's transcript.
static func admit(toolName: String, tools: OrbitPlanTools) throws {
    let id: OrbitToolID? = switch toolName {
    case "search_saved_places": .savedPlaces
    case "search_apple_maps": .mapKitSearch
    case "get_route": .mapKitRoute
    case "get_weather": .weatherKit
    default: nil
    }
    if let id, !tools.isEnabled(id) {
        throw OrbitPlannerError.toolTurnedOff(toolName)
    }
}

// in the profile body:
.onToolCall { [turn, steps] call in
    try Self.admit(toolName: call.toolName, tools: turn.tools)
    turn.recordToolCall()
    // ...
}
.transcriptErrorHandlingPolicy(.preserveTranscript)
```

Throwing from a tool or `onToolCall` aborts the loop and, by default, rolls the transcript back; `.preserveTranscript` keeps it, and then fixing it is your job ([242](https://developer.apple.com/videos/play/wwdc2026/242/)).

Cricket: the third umpire is consulted only when the on-field umpire sends it up. The commentator can't call for a review.

---

## 5. Images: the replay screen

**In plain words.** The commentator can now look at the replay. You hand them a picture next to your question. For things a picture can't tell a language model reliably — reading a scoreboard's digits, a ticket's barcode — there are system tools that do the reading.

```swift
let response = try await session.respond {
    "What field position is the fielder in?"
    Attachment(replayFrame)    // UIImage, CGImage, CVPixelBuffer, file URL...
}
```

### `Attachment` prompts

Image attachments work from `UIImage`, `NSImage`, `CGImage`, Core Image types, CoreVideo pixel buffers and file URLs, at any size and aspect ratio — but bigger images cost more tokens and latency ([241](https://developer.apple.com/videos/play/wwdc2026/241/)). Attachments can carry a `.label(...)`, and a tool can take an `ImageReference` argument and resolve it against the transcript ([237](https://developer.apple.com/videos/play/wwdc2026/237/)).

Folio already uses it, with an umpire-style instruction:

```swift
// from Folio/Sources/Folio/Folio.swift
let session = LanguageModelSession(instructions: "Describe only visible design details. Do not infer the app's functionality or claim that this mockup is a real product.")
let response = try await session.respond {
    "Briefly describe the visible layout, colors, and interface elements in this design."
    Attachment(imageURL: imageURL)
}
```

Xcode 27.2 beta goes further: `DataAttachmentRepresentable` lets your own binary types, identified by `UTType`, travel in prompts and transcripts ([docs](https://developer.apple.com/documentation/foundationmodels/dataattachmentrepresentable), marked beta; Foundation Lab's `fmf.md` records the change against the 27.2 beta SDK interface). Treat it as beta until it ships.

Breakline's coach instructions are the best example of keeping the commentator honest about a still frame: "A still frame does not establish motion, timing, board pressure, wave conditions, or eye direction … Never invent an observation or measurement" (`SurfCoach/App/iOS/CoachProfile.swift`). For cricket: a single frame can't tell you whether the ball was swinging.

### Vision tools: `OCRTool` and `BarcodeReaderTool`

Foundation Models now ships two Vision-backed tools: `OCRTool` extracts structured text, `BarcodeReaderTool` reads barcodes ([241](https://developer.apple.com/videos/play/wwdc2026/241/), [237](https://developer.apple.com/videos/play/wwdc2026/237/)):

```swift
let session = LanguageModelSession(model: model, tools: [BarcodeReaderTool()])
let response = try await session.respond(generating: EventInfo.self) {
    "Get the date, location, and website from this flyer"
    Attachment(image).label("flyer")
}
```

A scorecard photo is the cricket case: OCR reads the digits; the umpire code checks they add up; the commentator talks about the innings. There's also a Spotlight-backed search tool for fully local RAG ([241](https://developer.apple.com/videos/play/wwdc2026/241/); see session 246).

> **In Crease:** a paper-scorecard reader that attaches the photo with `.label("paper_scorecard")` and gives the model an OCR tool to read it.

### Geometry is the umpire too: a specs try-on sketch

Not every image feature needs a language model. Here's a feature I haven't built, sketched the umpire/commentator way: try on glasses from a photo.

```swift
// Sketch: the specs try-on flow (not shipped; FaceLandmarks, SpecsDesigner and Overlay are made-up app types)
let points = try await FaceLandmarks.read(photo)       // Vision: pupils, nose, brows
let specs  = await SpecsDesigner.design("round tortoiseshell") // optional Image Playground drawing
let result = Overlay.place(specs, between: points.leftPupil, and: points.rightPupil)
```

Vision's `DetectFaceLandmarksRequest` ([docs](https://developer.apple.com/documentation/vision/detectfacelandmarksrequest)) is the umpire. It finds the pupils, and plain geometry decides where the frames sit and how wide they are. The generated drawing is the commentator's flourish: it can change the style, never the fit. If the drawing fails or Image Playground isn't supported, the app still places a plain frame correctly. I already read face landmarks in two other repos (`LineageMirror`, `FaceFrame`), so the umpire half exists.

### Image Playground

For *making* images, adopt `imagePlaygroundSheet` with concepts (`.text`, `.extracted(from:title:)`, `.drawing`), a `sourceImage`, `ImagePlaygroundOptions` for size and personalization, and `imagePlaygroundGenerationStyle`, including `.externalProvider` and `.emoji` ([375](https://developer.apple.com/videos/play/wwdc2026/375/)). Check `@Environment(\.supportsImagePlayground)`. And note: **`ImageCreator`, the non-UI API, is deprecated** ([375](https://developer.apple.com/videos/play/wwdc2026/375/)).

Wearover seeds the sheet from what the model saw:

```swift
// from Wardrobe/Wardrobe/UI/TryOnView.swift
.imagePlaygroundSheet(
    isPresented: $showingPlayground,
    concepts: model.request.playgroundConcepts(seen: model.outfitDescription),
    sourceImage: model.playgroundSource.map { Image(decorative: $0, scale: 1) },
    onCompletion: { url in Task { await model.applyGenerated(at: url, style: redrawStyle) } }
)
```

---

## 6. Siri: the stadium announcer

**In plain words.** Siri is the stadium announcer: it can tell the whole ground what's happening and take requests from the crowd. To let it talk about your app, you describe your app's *things* (matches, players) and *actions* (start a match, add a wicket) in a form Siri already understands.

```swift
struct LogWicketIntent: AppIntent {
    static let title: LocalizedStringResource = "Log a wicket"
    @Parameter(title: "Batter") var batter: PlayerEntity

    func perform() async throws -> some IntentResult {
        try await Scorebook.shared.recordWicket(batter.id)   // the umpire records it
        return .result()
    }
}
```

### App Intents and `AppShortcutsProvider`

App Intents are the base. `AppShortcutsProvider` gives intents spoken phrases with no setup ([docs](https://developer.apple.com/documentation/appintents/appshortcutsprovider)). Four of my apps already have one; Low Roller's:

```swift
// from LowRoller/App/Intents.swift
struct LowRollerShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: PauseTradingIntent(),
            phrases: ["Pause my trading in \(.applicationName)", "Take a trading break with \(.applicationName)"],
            shortTitle: "Pause trading",
            systemImageName: "pause.circle"
        )
        // ...
    }
}
```

### App Schemas

App Schemas give Siri "a predefined understanding of common concepts". Entities conform to a schema with `@AppEntity(schema:)`, actions with `@AppIntent(schema:)`, and schemas are grouped into domains such as mail, photos and messages ([240](https://developer.apple.com/videos/play/wwdc2026/240/)). Sessions this year show `.messages.message`, `.calendar.event`, `.clock.createTimer`, `.audio.song`, `.system.searchInApp` ([240](https://developer.apple.com/videos/play/wwdc2026/240/), [343](https://developer.apple.com/videos/play/wwdc2026/343/)). Make schematized entities `IndexedEntity` and map text into Spotlight with `@Property(indexingKey:)` ([240](https://developer.apple.com/videos/play/wwdc2026/240/)).

There's no cricket domain, and I won't invent one. The honest cricket mapping is a fixture as `.calendar.event`, and match search through `.system.searchInApp`. **None of my apps adopt an App Schema yet.**

> Check the exact schema names in Xcode's autocomplete before you adopt one; it lists every schema by domain ([240](https://developer.apple.com/videos/play/wwdc2026/240/)).

### `IntentValueQuery` and Visual Intelligence

Visual Intelligence lets someone point the camera, or look at their screen, and get results from your app. You implement an `IntentValueQuery` whose `values(for: SemanticContentDescriptor)` returns your entities (use `@UnionValue` to return several kinds), plus `OpenIntent`s to land on the right screen, plus optionally an `@AppIntent(schema: .visualIntelligence.semanticContentSearch)` intent for "more results" ([297](https://developer.apple.com/videos/play/wwdc2026/297/)). Apple's example matches album covers with Vision feature prints:

```swift
// Shape from session 297 (5:39), cricket-flavoured
import AppIntents
import VisualIntelligence

struct ScorecardSearch: IntentValueQuery {
    @Dependency var archive: MatchArchive
    func values(for input: SemanticContentDescriptor) async throws -> [MatchEntity] {
        guard let pixelBuffer = input.pixelBuffer else { return [] }
        return try await archive.matches(resembling: pixelBuffer)
    }
}
```

`IntentValueQuery` also powers cross-app hand-off, alongside `IntentValueRepresentation` and `.appEntityIdentifier(...)` view annotations ([240](https://developer.apple.com/videos/play/wwdc2026/240/)). **Unused across my apps.**

> **In Crease (planned):** point the camera at a printed scorecard or a broadcast graphic and land on that match.

### AppIntentsTesting

Intents can now be tested by definition, from your test target ([295](https://developer.apple.com/videos/play/wwdc2026/295/)):

```swift
import AppIntentsTesting

func testLogWicket() async throws {
    let definitions = IntentDefinitions(bundleIdentifier: "com.example.crease")
    let logWicket = definitions.intents["LogWicketIntent"]
    let result = try await logWicket.makeIntent(batter: "Kohli").run()
    // assert on result.value
}
```

Entity string queries and chained intents are testable the same way.

---

## 7. Quality and safety: DRS for your prompts

**In plain words.** Language models give different answers to the same question, so a unit test that checks for one exact sentence is useless. Instead you run hundreds of deliveries and check the *rate*: how often the call was right. That's the Evaluations framework. Then you watch the replay frame by frame (Instruments). And you defend the booth against fans shouting fake instructions (prompt injection).

```swift
// The umpire's metric, not the model's opinion.
let mentionsOnlyRecordedRuns = Metric("MentionsOnlyRecordedRuns")
Evaluator { sample, subject in
    Scorebook.numbers(in: subject.value.line).isSubset(of: sample.recordedNumbers)
        ? mentionsOnlyRecordedRuns.passing()
        : mentionsOnlyRecordedRuns.failing(rationale: "Invented a number")
}
```

### The Evaluations framework

`import Evaluations`, conform a type to `Evaluation`, give it a dataset of `ModelSample`s, define `Metric`s and `Evaluator`s, aggregate (mean, standard deviation, variance), and run it from Swift Testing with `.evaluates(evaluation, info:)` and an `#expect` on the aggregate ([298](https://developer.apple.com/videos/play/wwdc2026/298/)). You can synthesize more samples with `makeSamples` or a `SampleGenerator` — Apple's example uses PCC to generate data and a validator to reject bad samples ([299](https://developer.apple.com/videos/play/wwdc2026/299/)).

For agents, evaluate the **trajectory**, not just the answer: `TrajectoryExpectation` with ordered/unordered `ToolExpectation`s, argument matchers (`.exact`, `.naturalLanguage`, `.keyOnly`, `.contains`, `.oneOf`, `.pattern`, `.range`) and `disallowed` tools ([299](https://developer.apple.com/videos/play/wwdc2026/299/)). For cricket: "who has the most runs?" must call `careerStats`, and must never call `postToFeed`.

Apple's line about PCC versus on-device applies to every choice in this post: decide "based on data, not just vibes" ([319](https://developer.apple.com/videos/play/wwdc2026/319/)). And because history rewrites can confuse the model, Apple says to evaluate context-engineering strategies the same way ([242](https://developer.apple.com/videos/play/wwdc2026/242/)). **No app of mine has an Evaluation yet.**

> **In Crease:** a `CommentaryFaithfulnessEvaluation` that scores one property: the commentator never claims a ball outcome the match engine didn't produce. The same audit code replaces an unfaithful live line with a plain template line.

### Instruments for agents

The upgraded Foundation Models instrument has six lanes, including an **Instructions** lane that shows which instruction set was active and when, and a Model Inference lane; the tree view and inspector show the exact prompt tied to each inference ([243](https://developer.apple.com/videos/play/wwdc2026/243/)). Apple's demo bug is the one I've hit: a hand-off that should have switched instructions never did, visible at a glance in that lane. Use it for KV-cache invalidations too ([242](https://developer.apple.com/videos/play/wwdc2026/242/)).

### The `fm` command line tool and the Python SDK

`fm` ships with macOS 27: `fm respond "..."`, `--model pcc`, `--image`, `--instructions`, and `fm schema object ...` to build a JSON schema for structured output; `fm chat` for exploring ([334](https://developer.apple.com/videos/play/wwdc2026/334/), [241](https://developer.apple.com/videos/play/wwdc2026/241/)). The Python SDK (`pip install apple_fm_sdk`) supports sessions, tools and guided generation against the same on-device model, which makes it a natural home for eval pipelines in Python ([334](https://developer.apple.com/videos/play/wwdc2026/334/)).

```bash
fm schema object --name BallCall --string line > /tmp/ball.json
fm respond "Describe: short ball, pulled for six over square leg" --schema /tmp/ball.json
```

Low Roller's instructions are shaped by `fm`: "Worded positively on purpose: lists of 'never' rules and helpline lines made the on-device model's guardrails reject ordinary questions (tested with `fm`). Those rules are enforced in code instead: CoachGuard before the model, soundsLikeAdvice after it." That comment is this whole post in two sentences.

### Indirect prompt injection

**Indirect prompt injection** is instructions hidden in content the model reads — a calendar event, a friend's post — that try to redirect what it does ([347](https://developer.apple.com/videos/play/wwdc2026/347/)). Apple frames the danger with Simon Willison's "lethal trifecta": private data, untrusted content, and the ability to communicate externally. Apple's mitigations ([347](https://developer.apple.com/videos/play/wwdc2026/347/)):

1. Threat-model: list every source of untrusted context and every action with side effects.
2. Require user confirmation for risky tools, in `onToolCall`.
3. "Spotlight" untrusted tool output with delimiters in a `historyTransform` — a probabilistic mitigation, not a guarantee.
4. Solving it is "an active research area"; aim to reduce risk.

For a cricket app, untrusted content is a fan forum, a shared match link, a commentary feed. The commentator can read the crowd. The crowd never gets to tell the umpire what to do.

---

## 8. Concurrency: one ball at a time

**In plain words.** A commentator can only describe one ball at a time. If you ask the same notebook two questions at once, the framework refuses. And when a new ball is bowled, the line about the old ball is stale: stop it.

```swift
@MainActor @Observable final class LiveCommentary {
    private let session = LanguageModelSession(instructions: "One sentence per ball.")
    private var current: Task<Void, Never>?
    var line = ""

    func ballBowled(_ event: BallEvent) {
        current?.cancel()                         // the last ball's line is stale
        current = Task {
            guard !session.isResponding else { return }
            line = (try? await session.respond(to: event.summary).content) ?? event.summary
        }
    }
}
```

### Actor isolation

`LanguageModelSession` is a `final class` that is `Sendable` ([242](https://developer.apple.com/videos/play/wwdc2026/242/), code at 17:51), so you can hold it from an actor. Pick one owner and stick to it. Quorion's `AIBotBrain` is `@MainActor`; Orbit's drafter guards its session with a lock because its profile, tools and app share `OrbitPlannerTurn` across isolation domains (`PlaceMatch/PlaceMatch/Services/OrbitPlanner.swift`). Lifecycle callbacks there hop back explicitly: `await MainActor.run { steps.toolStarted(name: name) }`.

### One request per session

A session handles one request at a time; a second concurrent one fails with `LanguageModelSession.Error.concurrentRequests` ([docs](https://developer.apple.com/documentation/foundationmodels/languagemodelsession/error/concurrentrequests)). Check `isResponding`, or serialize in your own model. Low Roller does the simplest thing:

```swift
// from LowRoller/App/Coach/CoachModel.swift
func send(_ text: String, state: AppState) async {
    let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !trimmed.isEmpty, !isThinking else { return }
    // ...
    isThinking = true
    defer { isThinking = false }
```

When you need parallel work, use separate sessions — Quorion keeps one per seat, and phone-a-friend spawns a child.

### Cancelling stale work

Cancelling a response rolls the transcript back to its previous state by default ([242](https://developer.apple.com/videos/play/wwdc2026/242/)), so cancelling a stale line is safe. If you set `.preserveTranscript`, cancellation leaves a partial turn and repairing it is your job. And because `perform()` in App Intents isn't `@MainActor`, the same discipline applies when Siri drives the session.

> **In Crease:** the live booth keeps one session for the match and drops a stale line when the next ball is bowled.

---

## 9. Languages and String Catalogs: two kinds of text

**In plain words.** An app has two kinds of words on screen. Words *you* wrote, like button labels and error messages, live in a String Catalog (`.xcstrings`) and get translated ahead of time. Words the *model* writes are made fresh at runtime, in whatever language the model supports. Keep the two apart: the scoreboard labels are printed; the commentary is live.

```swift
struct CommentaryLine: View {
    let line: String?        // model output: never a catalog key
    var body: some View {
        if let line {
            Text(verbatim: line)
        } else {
            Text("Commentary unavailable")   // catalog key, translated ahead of time
        }
    }
}
```

The rules:

- **Ask before you prompt.** `SystemLanguageModel` has `supportsLocale(_:)`, and `PrivateCloudComputeLanguageModel` has an `async throws` version ([docs](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel/supportslocale(_:)), [docs](https://developer.apple.com/documentation/foundationmodels/privatecloudcomputelanguagemodel/supportslocale(_:))). Foundation Lab's `LanguageService.swift` lists the supported languages and matches the user's language and region against them.
- **Handle the failure in your own words.** Breakline turns `LanguageModelError.unsupportedLanguageOrLocale` (and `.timeout`, `.refusal`, `.contextSizeExceeded`) into catalog-backed copy:

```swift
// from SurfCoach/VideoCore/Sources/VideoCore/CoachErrorPresentation.swift
if let modelError = error as? LanguageModelError {
    switch modelError {
    case .timeout:
        return timeout
    case .guardrailViolation, .refusal:
        return refusal
    case .contextSizeExceeded:
        return contextSizeExceeded
    case .unsupportedLanguageOrLocale:
        return unsupportedLanguage
    default:
        break
    }
}
```

- **Model output never becomes a catalog key.** Show it with `Text(verbatim:)`, or keep it out of `LocalizedStringKey` some other way, so the String Catalog doesn't collect thousands of one-off model sentences. Quorion, Breakline and Orbit each keep their app copy in an `.xcstrings`, and Foundation Lab's `Localizable.xcstrings` covers ten languages.
- Don't assume the reply's language follows the user. If your instructions are English and the user writes Hindi, check what comes back with an evaluation per locale (section 7).

---

## 10. The macros doing the work

**In plain words.** Most of the code above is short because Swift macros write the long parts for you. A macro is a label you stick on a type, and the compiler expands it into code at build time. In cricket terms, it's the printed scoresheet with the boxes already drawn: you just fill them in.

```swift
@Generable                       // expands into a schema the model must fill
struct BallCall {
    @Guide(description: "Under 25 words")   // a constraint on one box
    var line: String
}
```

The ones in this post, and what each one writes for you:

| Macro | What it's for | Where it appears |
|---|---|---|
| `@Generable` | Turns a struct or enum into an output schema (and tool `Arguments`) | Low Roller `CoachReply`, Orbit `OrbitPlanScope` |
| `@Guide` | A description and constraints on one property | Low Roller `@Guide(..., .maximumCount(3))` |
| `@SessionPropertyEntry` / `@SessionProperty` | Session-wide state shared by profiles and tools | [242](https://developer.apple.com/videos/play/wwdc2026/242/); `@SessionProperty(\.history)` in a tool in [237](https://developer.apple.com/videos/play/wwdc2026/237/) |
| `@LanguageModelSession.DynamicProfileBuilder` | A result builder, not a macro, but the same idea: `if`/`switch` inside a profile | Breakline `CoachProfile` |
| `@AppEntity(schema:)` / `@AppIntent(schema:)` | Makes an entity or intent match a Siri App Schema | [240](https://developer.apple.com/videos/play/wwdc2026/240/), [343](https://developer.apple.com/videos/play/wwdc2026/343/) |
| `@Property(indexingKey:)` | Maps an entity value into Spotlight | [240](https://developer.apple.com/videos/play/wwdc2026/240/) |
| `@UnionValue` | One query returns several entity types | [297](https://developer.apple.com/videos/play/wwdc2026/297/) |
| `@Parameter` | An intent's input | every App Intent |

Two habits:

- **Look at the expansion.** In Xcode, right-click the macro and choose Expand Macro to see the schema `@Generable` actually generates. It's the fastest way to see why the model filled a box the way it did.
- **Order is part of the schema.** "The model generates `Generable` properties in the order they're declared" ([docs](https://developer.apple.com/documentation/foundationmodels/generating-swift-data-structures-with-guided-generation)), so put the property the model should "think" with first (a reason, a plan) and the final answer after it. In Low Roller, `reply` comes before `actions`, so the buttons are picked after the text exists.

---

## 11. MCP: the coding booth and your app

Plainly: **WWDC26 did not add MCP to the Foundation Models framework.** None of the Foundation Models sessions I read (241, 242, 319, 339) mention it. MCP arrived in **Xcode 27**, for the coding agents that help you build your app ([102](https://developer.apple.com/videos/play/wwdc2026/102/), [382](https://developer.apple.com/videos/play/wwdc2026/382/)):

- Xcode 27 ships Apple's expertise "as a corpus of skills, documentation, and MCP tools".
- Xcode connects through MCP to tools like Figma and GitHub.
- **Plugins** can contain skills ("just markdown files that teach the agent new tasks"), MCP tools, and — with the **Agent Client Protocol** — an agent of your choice, including local ones. You decide what each plugin can see; everything else needs your approval ([382](https://developer.apple.com/videos/play/wwdc2026/382/)).

So there are two different "skills" in this post. The app-side `Skills` type in Foundation Models utilities loads procedural context into *your app's* model. Xcode plugin skills teach *your coding agent*. Same idea, different booth.

MCP is not limited to Xcode: the [official Swift SDK](https://github.com/modelcontextprotocol/swift-sdk) supports app-side clients and servers. To bring an MCP server's data into a Foundation Models conversation, your app can adapt an admitted server call as a `Tool` (or use an appropriate provider or workflow adapter). Treat server output as untrusted content and keep access and write decisions in app code. Connecting a server does not give the model authority to perform every action it exposes.

---

## 12. What we haven't tried yet

On 2026-11-03 I searched every app in this post for each API. The newest patterns are in Breakline (profiles, token ledger, test-model seam) and Orbit (tool calling mode, tool admission, `DynamicGenerationSchema` repair, `.preserveTranscript`). Quorion moved off per-line sessions today. These five have **zero uses** across all of them:

| API | Session | Why it matters for my apps | In Crease |
|---|---|---|---|
| `PrivateCloudComputeLanguageModel` | [319](https://developer.apple.com/videos/play/wwdc2026/319/) | Orbit's trip planning and Origami-style tutorials want reasoning and 32K context. Needs the entitlement and quota UI. | Captain's field planning, when switched on |
| `Skills` (utilities) | [242](https://developer.apple.com/videos/play/wwdc2026/242/) | Low Roller's lessons and Breakline's drills are procedural knowledge loaded every turn today. | Rules explainers |
| Evaluations | [298](https://developer.apple.com/videos/play/wwdc2026/298/), [299](https://developer.apple.com/videos/play/wwdc2026/299/) | Every "I tested it on device and it seemed fine" in my commit messages should be a number. | Commentary faithfulness |
| App Schemas | [240](https://developer.apple.com/videos/play/wwdc2026/240/) | Four apps have `AppShortcutsProvider`; none are schematized for the new Siri. | Planned |
| Visual Intelligence (`IntentValueQuery`) | [297](https://developer.apple.com/videos/play/wwdc2026/297/) | Wearover (point at an outfit) and Folio (point at a design) are the obvious fits. | Planned |

Also unused, and worth a look: `OCRTool` and `BarcodeReaderTool`, `response.usage`, `onResponse` summaries, and AppIntentsTesting.

That's why Crease exists. A cricket app is the cleanest place to show the split: the laws of cricket are completely written down, so the umpire can be pure code, and cricket talk is endlessly rich, so the commentator has real work to do.

The rule I'd tape above the desk:

> **The umpire decides. The commentator explains. The commentator never touches the scoreboard.**

---

### Sources

WWDC26 sessions: [102 Platforms State of the Union](https://developer.apple.com/videos/play/wwdc2026/102/) · [237 What's new in image understanding](https://developer.apple.com/videos/play/wwdc2026/237/) · [240 App Schemas](https://developer.apple.com/videos/play/wwdc2026/240/) · [241 What's new in Foundation Models](https://developer.apple.com/videos/play/wwdc2026/241/) · [242 Agentic app experiences](https://developer.apple.com/videos/play/wwdc2026/242/) · [243 Instruments for agentic apps](https://developer.apple.com/videos/play/wwdc2026/243/) · [295 AppIntentsTesting](https://developer.apple.com/videos/play/wwdc2026/295/) · [297 Visual Intelligence](https://developer.apple.com/videos/play/wwdc2026/297/) · [298 Meet the Evaluations framework](https://developer.apple.com/videos/play/wwdc2026/298/) · [299 Evaluations for agentic apps](https://developer.apple.com/videos/play/wwdc2026/299/) · [319 Private Cloud Compute](https://developer.apple.com/videos/play/wwdc2026/319/) · [334 fm CLI and Python SDK](https://developer.apple.com/videos/play/wwdc2026/334/) · [339 Bring an LLM provider](https://developer.apple.com/videos/play/wwdc2026/339/) · [343 Advanced App Intents](https://developer.apple.com/videos/play/wwdc2026/343/) · [347 Mitigate risks to agentic features](https://developer.apple.com/videos/play/wwdc2026/347/) · [375 Image Playground](https://developer.apple.com/videos/play/wwdc2026/375/) · [382 Inside Apple Intelligence and Xcode](https://developer.apple.com/videos/play/wwdc2026/382/)

Apple docs: [DynamicGenerationSchema](https://developer.apple.com/documentation/foundationmodels/dynamicgenerationschema) · [PromptRepresentable](https://developer.apple.com/documentation/foundationmodels/promptrepresentable) · [AppShortcutsProvider](https://developer.apple.com/documentation/appintents/appshortcutsprovider) · [LanguageModelSession.Error.concurrentRequests](https://developer.apple.com/documentation/foundationmodels/languagemodelsession/error/concurrentrequests) · [permissive guardrails](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel/guardrails/permissivecontenttransformations) · [guided generation](https://developer.apple.com/documentation/foundationmodels/generating-swift-data-structures-with-guided-generation) · [supportsLocale](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel/supportslocale(_:)) · [DataAttachmentRepresentable (beta)](https://developer.apple.com/documentation/foundationmodels/dataattachmentrepresentable) · [DetectFaceLandmarksRequest](https://developer.apple.com/documentation/vision/detectfacelandmarksrequest)

Reference repos: [apple/foundation-models-utilities](https://github.com/apple/foundation-models-utilities) (1.0.0-beta5) · [rudrankriyam/Foundation-Models-Framework-Lab](https://github.com/rudrankriyam/Foundation-Models-Framework-Lab)
