---
title: "Meta AI vs Apple Intelligence: one Diwali kurta, one gym selfie"
date: '2026-11-08'
excerpt: "I asked Meta AI in WhatsApp and Apple's Image Playground, inside my app Wearover, for the same premium cream Diwali kurta with gold embroidery on the same photo. Meta redrew my whole photo. Apple Intelligence drew only the clothes, and my face stayed mine."
categories: [apple-intelligence, image-playground, swift, wearover]
keywords: [meta-ai, whatsapp, image-playground, apple-intelligence, wearover, diwali, kurta, private-cloud-compute, vision]
type: post
agent:
  name: "Claude Code"
  model: "Opus 5.5"
  tool: "Claude Code"
---

> **Same selfie, same Diwali kurta. Meta AI redraws you. Apple Intelligence dresses you.**

![Before, Meta AI and Apple Intelligence in Wearover, side by side](/wearover/meta-vs-image-playground-banner.png)

Same photo: me in a white tee at the gym. Same words to both: **"premium creamy Diwali kurta with
gold embroidery."**

- **Meta AI in WhatsApp** got the whole photo and sent back a new one.
- **Apple Intelligence**, through Image Playground inside my app [Wearover](/apps), got only the
  part of the photo below my chin and drew a kurta for it. Wearover put that kurta back onto my
  original photo.

[Watch the 13-second comparison (MP4)](/wearover/meta-vs-wearover-reel.mp4)

## What each one got right

**Meta AI** makes a lovely kurta. It's knee length, with heavy gold work on the collar, the placket
and the cuffs. Because it redraws the whole picture, it can change how long the garment is.

The cost is that it redraws *you* too. Look closely and the face is very nearly mine, but it isn't
my photo any more. And the whole photo, face included, went to Meta's servers to get there.

**Apple Intelligence in Wearover** drew cream silk with a gold-embroidered collar, placket and
cuffs, and small gold motifs across the body. The face, hair and background are the original
pixels. What left the phone was a crop of the clothes, sent to Apple's Private Cloud Compute.

The trade is length. Wearover only redraws the area the old top covered, so this kurta ends at
the hip, not the knee. That's the next thing to fix.

![Image Playground's drawing, before Wearover fits it to the photo](/wearover/image-playground-drawing.png)

## How it works, in pseudo-code

```swift
// 1. Find the person and their clothes on the phone (Vision).
let person = try await vision.personMask(in: photo)
let top    = try await vision.clothingRegion(.top, in: photo, below: person.chin)

// 2. Read the words into a fixed shape (Foundation Models, @Generable).
@Generable struct Look {
    var colour: Colour        // cream
    var fabric: Fabric        // silk
    var style: Style          // festive  ← "Diwali" means festive
    var detail: Detail        // goldEmbroidery
}

// 3. Send Image Playground only the clothing crop, never the face.
let crop    = photo.cropped(to: top.box)          // starts below the chin
let drawing = await imagePlayground(crop, concepts: look.concepts)   // you tap ✓

// 4. Put the drawing back inside the old top's outline. Face and background untouched.
let result = photo.replacing(top.mask, with: drawing)
```

Two bugs this test turned up are already fixed in the next build:

- An older build added the default **Navy** swatch to my words. Image Playground got "navy top,
  creamy kurta" and drew a kurta that was half navy, half cream.
- "Kurta **with** gold embroidery" was split at "with", so the embroidery never reached Image
  Playground. Details like embroidery, zari and mirror work are now a fixed list the model picks
  from. They show up as a chip on the card, and Image Playground gets them as their own instruction.

## Halloween, and tattoos

Same photo, one more ask: **"Halloween Joker makeup."** This one is different on purpose. A makeover
has to change your face, so Wearover asks first ("Send your face to Image Playground?") and only
then sends a crop of your face. Image Playground paints the makeup onto *you*, and Wearover blends
it back into the photo with a soft edge. Undo puts your original face back, and Settings can turn
makeovers off.

![Joker makeover: Image Playground's drawing, and the drawing fitted back into the photo](/wearover/joker-makeover.png)

Tattoos work like the clothes: Image Playground draws the design from words ("delicate swallow in
flight, black line-art"), and Wearover places it on the arm it found in your photo.

![A swallow tattoo drawn by Image Playground](/wearover/swallow-tattoo.png)

## Which wins?

For a picture you'll post as *you*, Apple Intelligence through Wearover wins: your face is your
face, your photo stays on your phone, and when you *want* your face changed, it asks first. For pure garment drama, Meta's longer kurta is ahead
today, and that's the gap I'm closing next.

Wearover is on the App Store for iPhone and Mac.
