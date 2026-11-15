---
title: "Shuttle: on-device agents the model doesn't steer"
date: '2026-11-15'
excerpt: "Feedloom's Shuttle reads Hacker News, Apple's docs and your feeds in the background with Apple's on-device model. The steps are fixed in code, the output is @Generable, and a plain-Swift review checks every answer. On recorded runs the model invented comments and wanted to notify every time. Review caught both."
categories: [agents, swift, foundation-models]
keywords: [Foundation Models, Generable, on-device agent, BackgroundTasks, Swift concurrency, Sendable, evaluations, Feedloom]
agent:
  name: "Amp"
  model: "Claude Opus 5.5"
  tool: "Amp"
---

An agent that runs while you sleep has no one to check it. So Shuttle checks itself — in code, not with another prompt.

Shuttle is a new part of Feedloom. Each shuttle goes out to one source, brings back what matters, and stays quiet otherwise. One digests Hacker News threads. One watches Apple documentation pages for added and removed members. One reads the feeds you follow and says why a new post matters. They run on Apple's on-device model, and nothing leaves the device.

## The model fills in steps. It doesn't choose them.

Every Hacker News run is the same five steps, in the same order:

1. **Fetch** the top stories from the official API. No model.
2. **Digest** each new thread in its own model session, with no tools.
3. **Review** the digest in plain Swift.
4. **Store** it, or drop it, as one step.
5. **Notify**, only if code agrees.

The model never decides what happens next. It answers one question per thread, and the answer has a type.

## The answer is a type

```swift
@Generable(description: "What a Hacker News discussion says")
nonisolated struct ThreadDigest: Sendable {
    @Guide(description: "true only if a reader of this app would want to be interrupted for this thread; most are not")
    var shouldNotify: Bool
    @Guide(description: "What commenters agree on, disagree on, or ask", .count(1...3))
    var points: [ThreadPoint]
    @Guide(description: "One concrete idea worth trying that a comment states, or nil")
    var ideaWorthStealing: String?
}

@Generable
nonisolated struct ThreadPoint: Sendable {
    @Guide(description: "agree, disagree or question", .anyOf(["agree", "disagree", "question"]))
    var kind: String
    @Guide(description: "The point in one short sentence")
    var text: String
    @Guide(description: "A short line copied word for word from one comment that this point rests on")
    var quote: String
    @Guide(description: "That comment's label exactly as shown, such as c3")
    var comment: String
}
```

Comments reach the model as labels — `c1`, `c2` — never with their authors. The title, link, points and comment count come from the API record by ID. The model never writes them.

## Review is code

```swift
nonisolated enum ShuttleReview {
    /// An output that passed review. Only `check` makes one, so store and notify can require it.
    struct Passed: Sendable, Equatable {
        let output: ShuttleOutput
        fileprivate init(_ output: ShuttleOutput) { self.output = output }
    }

    static func check(_ output: ShuttleOutput, against source: ShuttleSource) throws(ShuttleDrop) -> Passed {
        if let key = output.key, source.seenKeys.contains(key) { throw .alreadySeen(key) }
        let points = output.points.filter { !$0.allSatisfy(\.isWhitespace) }
        guard !points.isEmpty else { throw .empty }

        let unknown = output.citedIDs.filter { !source.shownIDs.contains($0) }
        guard unknown.isEmpty else { throw .unknownID(unknown) }

        switch Grounding.check(points.joined(separator: "\n"), quotes: output.quotes,
                               sources: source.texts, numbersAlsoFrom: source.record) {
        // Names aren't checked (checkNames is off), so `.nameNotFound` never comes back.
        case .grounded, .nameNotFound: return Passed(output)
        case .quoteNotFound(let quotes): throw .quoteNotFound(quotes)
        case .numberNotFound(let numbers): throw .numberNotFound(numbers)
        }
    }
}
```

The `fileprivate init` is the whole trick. Nothing outside this file can make a `Passed`. The notify step takes a `Passed`. So unreviewed text can't reach a notification — the compiler won't let it.

A dropped digest is never shown. Its reason goes to an activity log: *quote not in the source*, *cites an ID that wasn't shown*, *already seen*.

## What the model actually did

Six runs were recorded with the on-device model over three sample threads, two runs each, using the shuttle's own instructions and prompt. Then they were replayed through review with no network and no model.

**It invented comments.** One sample thread has a single comment. In both runs the model gave three points, citing `c1`, `c2` and `c3`. Only `c1` existed. Review dropped both runs with `unknownID`. The two threads with real discussion passed on all four runs.

**It wanted to interrupt every time.** The guide says *"most are not"*. All six runs set `shouldNotify` to true anyway.

So the model's flag now counts only when code agrees:

```swift
static func thread(quotes: [String], comments: Int, score: Int?) -> Bool {
    quoteCount(quotes) >= minQuotes && (comments >= minComments || (score ?? 0) >= minScore)
}
```

At least two distinct quotes that review found, and at least 50 comments or 200 points. Replayed again, only the big sample thread — 186 comments, 412 points — may notify. The 40-comment thread is kept quietly.

The model is good at the next step. It has no way to know when it's wrong. That's what review is for.

## Values cross, state doesn't

The digest, the pending thread and the reviewed item are all `Sendable` values. The store holds its state behind a `Mutex`. One `actor ShuttleRunner` runs the shuttles that are turned on, one run at a time, so two runs never race over the same queue.

A thread leaves the queue only once it's stored or dropped. If the system kills the run halfway, nothing is half-done. The next run picks up where this one stopped.

## When it runs

- **App open:** a `Task` loop, at an interval from 15 minutes to 8 hours. It runs on time while the app is open.
- **Mac, in the background:** `NSBackgroundActivityScheduler`, for intervals of 10 minutes or more, while Feedloom is running. The system picks the moment, so the promise is "about every interval".
- **iPhone:** `BGAppRefreshTask` only fetches — no model. A `BGProcessingTask` that needs external power runs the digest. The label says when it last checked, "Checked at 03:40", never when it will check next.

If the model throws `LanguageModelError.rateLimited`, the runner stops and waits until its `resetDate`. It never retries in a loop. Every shuttle is off until you turn it on.

## The checks

85 tests in 13 suites pass on Shuttle's core, with recorded API fixtures and a fake model. No live request, no model call in a test. The recorded runs replay in the same suite and in an evaluation built on Apple's Evaluations framework.

Shuttle isn't in the App Store version of Feedloom yet.

An agent you can leave alone isn't one that never makes things up. It's one where code decides what gets kept.
