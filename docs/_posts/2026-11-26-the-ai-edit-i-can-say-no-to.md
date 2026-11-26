---
title: "The AI edit I can say no to"
date: '2026-11-26'
excerpt: "A proposed change, an apply button, and an undo: a small DocPolish interface for keeping the person in charge of their document."
categories: [docpolish, swiftui, apple-intelligence]
keywords: [pdf, review, previews, on-device-ai]
type: post
---

A document suggestion is easy to make. The harder part is showing exactly what it would change, and making sure the person holding the document gets the choice.

In DocPolish I've been exploring a small review card for that moment. It shows a proposed change, highlights the words removed and added, and offers **Apply**, **Edit**, and **Skip**. After an edit is applied to the working copy, the card offers **Undo**.

[See the light and dark previews](/showcase/#docpolish-preview). These are real Xcode renders of a SwiftUI preview using invented text. The two cards show proposed and applied states. They don't show a complete PDF import-and-edit session, and I haven't verified that this particular flow is in the App Store build.

## A suggestion should have a boundary

The original phrase in the sample is “one shared sheet.” The proposed phrase is “a shared online sheet.” That tiny example makes the decision visible: the person can see what would be removed and what would be added before choosing what to do.

For a real document, I'd want the app to find the source text it is proposing to change and avoid presenting a suggestion as if it had been applied already. Review, application, and export are separate moments. A useful interface should make each one clear.

This matters even more for documents that aren't simple text. A PDF may contain selectable text, scanned pages, tables or a mixture. A clean preview of one card cannot establish that every one of those journeys works. The capture is a way to inspect the interface—not proof of end-to-end behavior.

## Why use previews?

The card already has a `#Preview` with sample proposals. Xcode rendered it in light and dark appearances, which made it possible to inspect both states without using a real document. [Apple's preview documentation](https://developer.apple.com/documentation/xcode/adding-previews-to-your-interface-files) describes how previews help develop views in different configurations.

The next useful step is a complete, synthetic PDF journey: import a made-up page, show the proposed change, apply it, undo it, and check the resulting export. The card is a good place to begin. The journey is what will tell me whether the idea holds together.
