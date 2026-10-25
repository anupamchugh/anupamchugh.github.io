---
name: Anupam Chugh showcase
description: A client-facing wall of glass panes: every app is one pane, lit in its own colour; unreleased work is frosted.
colors:
  bar: "#0c0d0f"
  glass: "#eff3f2"
  seed: "#e3eae9"
  frost: "#dde6e5"
  ink: "#0c0d0f"
  ink-2: "#38413f"
  cobalt: "#1d4ed8"
  oxblood: "#7a1627"
  phone-bezel: "#050506"
  lit-rifflet: "#f2b01e"
  lit-common-ground: "#6d2fd9"
  lit-playlist-hunter: "#19a7b0"
  lit-pinprint: "#b9733c"
  lit-pastport: "#1f6f7a"
  lit-feedloom: "#4a35d8"
  lit-flickpot: "#2f8f46"
  lit-flyleaf: "#12907c"
  lit-getnod: "#6b4bd6"
  lit-best-face-forward: "#1d7a9a"
  lit-breakline-surf: "#0a8fa8"
  lit-checkmate-academy: "#6a3fd1"
  lit-clocktower-table: "#3b3f8f"
  lit-docpolish: "#1b8cff"
  lit-lineage-mirror: "#4f8a6e"
  lit-roamproof: "#1f6f55"
  lit-swell-window: "#1f7fc4"
  lit-the-match-room: "#1a7a58"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 5.4rem)"
    fontWeight: 560
    lineHeight: 1.03
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 120"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 3.4rem)"
    fontWeight: 560
    lineHeight: 1.08
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 114"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 580
    lineHeight: 1.1
    fontVariation: "'wdth' 114"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 420
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  icon: "16px"
  window: "12px"
  phone: "36px"
spacing:
  bar: "8px"
  pane: "28px"
components:
  pane:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink-2}"
    padding: "28px"
  pane-lit:
    backgroundColor: "{colors.lit-common-ground}"
    textColor: "#ffffff"
    padding: "28px"
  pane-frost:
    backgroundColor: "{colors.frost}"
    textColor: "{colors.ink}"
    padding: "28px"
  note-cobalt:
    backgroundColor: "{colors.cobalt}"
    textColor: "#ffffff"
    padding: "28px"
  note-oxblood:
    backgroundColor: "{colors.oxblood}"
    textColor: "#ffffff"
    padding: "28px"
  phone:
    backgroundColor: "{colors.phone-bezel}"
    rounded: "{rounded.phone}"
    padding: "6px"
---

# Design System: Anupam Chugh showcase

## Overview

**Creative North Star: "The Glass Wall"**

The page is one steel-framed glass partition. Matte black glazing bars are the only line ink; every app is a pane in the grid. Clear, seeded-white glass is the resting state. An app that is out in the world is lit from behind in its own icon colour. Work still in development is frosted. The wall is read like a map, and the interface recedes behind the screens it holds.

It is calm, architectural and exact. Colour is reserved for lit panes and for the two action notes (cobalt, oxblood), so a saturated field always means something is live or actionable. Hierarchy comes from pane size and glass colour, not from heavy type.

**Key Characteristics:**
- Black bars at a constant 8px (6px on phones); text sits inside a pane and never crosses a bar.
- One grotesque (Archivo, variable width and weight) for everything.
- Real screens in thin black bezels, sometimes cropped by the pane edge like a window.
- One slow brightening on load; no flashing, no looping motion.

## Colors

A cool-white ground with 18 app-coloured panes and two deep action notes.

### Primary
- **Cobalt Note** (#1d4ed8): the "Work with me" panes, including the floating one that stays at the bottom right until one of the page's own is on screen, and the dialog's send button. White text, 6.7:1.

### Secondary
- **Oxblood Note** (#7a1627): the closing statement pane. White text, 10.7:1.

### Tertiary
- **Lit App Glass** (`lit-*`, e.g. Orbits violet #6d2fd9, Rifflet amber #f2b01e): one colour per live app, hand-picked from its icon. Text on each is white or near-black, whichever contrasts more.

### Neutral
- **Glazing Bar Black** (#0c0d0f): the bars, the page surround, and the text ink.
- **Clear Glass** (#eff3f2): the resting pane. **Seeded Glass** (#e3eae9) and **Frost** (#dde6e5) are its tonal steps; frost marks work in development.
- **Ink 2** (#38413f): body text on glass, 9.4:1.

### Named Rules
**The Lit Means Live Rule.** A saturated pane is an app that is out in the world. Unreleased work is frosted and never lit.
**The Two Notes Rule.** Only the action panes use cobalt or oxblood; neither colours an app.

## Typography

**Display Font:** Archivo (variable, self-hosted, with system-ui fallback)
**Body Font:** Archivo
**Label/Mono Font:** none; tabular numerals only

**Character:** A quiet grotesque that can widen. Expanded width (wdth 114-120) gives the display a monumental, signage feel; normal width reads the body.

### Hierarchy
- **Display** (560, clamp(2.4rem, 5.4vw, 5.4rem), 1.03): the one headline.
- **Headline** (560, clamp(1.9rem, 3.6vw, 3.4rem), 1.08): section titles and the closing statement.
- **Title** (580, 1.45rem, 1.1): app names on panes.
- **Body** (420, 1.0625rem, 1.55, max 62ch): descriptions.
- **Label** (500, 0.875rem): the plate under each name (first commit, commit count).

### Named Rules
**The Pane Type Rule.** Type is set inside a pane and never across a glazing bar.

## Layout

A 12-column grid whose gap is the glazing bar. The hero is a fixed-height wall; case studies use a side layout (text beside two screens) or a stack layout (text above three screens). The all-apps wall varies pane spans (3, 4 or 6 columns) so every row sums to twelve. Below 880px every wall becomes one column and the bars stay at true thickness. Spacing rhythm: bar 8px, pane padding clamp(18px, 2.2vw, 36px).

## Elevation & Depth

Flat glass. Depth comes from one soft offset shadow under each phone bezel (0 24px 34px -20px, 60% black) and from the faint backlight on lit panes (a radial highlight from the top). Panes themselves carry no shadow. Frosted panes use a real blurred copy of their own screenshot behind the glass.

### Named Rules
**The Flat Wall Rule.** Panes never lift; only the phones inside them cast a shadow.

## Shapes

Panes are square-cornered: they are glass in a frame. Rounding belongs to what sits behind the glass: phone bezels (36px), app icons (16px), Mac windows (12px).

## Components

### Panes
- **Clear:** Clear Glass with a few faint "seed" bubbles; padding 28px.
- **Lit:** the app's colour with a soft top highlight; hover adds a 12% white overlay; focus is a white 3px ring inside a black 6px ring.
- **Frost:** Frost glass with a blurred copy of its screenshot at 24% opacity; text in full ink.
- **Note:** Cobalt or Oxblood, white text, arrow icon that slides 6px on hover.

### Device frame
A black bezel (#050506, 6px) around a real screenshot; Mac windows get a 12px radius and no bezel.

### Screen gallery
A full-width Lit pane under a case study that holds every captured screen of that app: four across, each phone with a one-line caption, and a plate that says when and on which build it was captured. Open by default on a wide screen, folded on a phone (a script closes it below 880px; without the script it stays open). The summary carries a plain-text Show or Hide label, not an icon. A live app's next-version screens may sit in its Lit pane when the plate says so, as with Feedloom's skins.

### Assistants and the "what is real" list
The Assistants section reuses the panes: Lit for a live app's assistant, Frost for work in development. A pane with no screens yet says so on its plate instead of borrowing a screenshot. Glint's "What is real here" list is a definition list (Live, Sample, Paper only, Never shown) set in a Frost pane beside the live captures.

### Links
Underlined 2px, offset 0.3em, ink colour, with an authored SVG arrow; minimum height 44px.

## Do's and Don'ts

### Do:
- **Do** keep every claim traceable to a link, a number from git, or a real screenshot.
- **Do** label sample data and in-development work on the pane itself.
- **Do** leave one slow brightening as the only load motion, and remove it under reduced motion.

### Don't:
- **Don't** light a pane for unreleased work, or frost a live app. (An assistant that is not shipped yet is frosted even when its app is lit.)
- **Don't** add kickers, section numbers or icon-over-heading card rows; the wall is the structure.
- **Don't** use glyph arrows or emoji as icons; draw them.
- **Don't** let a pane carry a hard offset shadow or gradient text.

<!-- Not canonized (defects or false positives, with reasons): the detector's 14 "cramped padding" hits and one "tight leading" hit come from clamp() values it cannot parse; panes measured at 18-36px padding and display lines are intentionally 1.03-1.08. Glyph arrows were replaced with SVG before documenting. -->
