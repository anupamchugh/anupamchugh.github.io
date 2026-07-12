---
layout: post
title: "Single Photo to 3D Gaussian Splat on Mac — In Under 10 Minutes"
date: 2026-02-07
categories: [3d, apple, visionos]
tags: [gaussian-splatting, sharp, metal, visionos, 3d-reconstruction]
draft: true
published: false
---

A Waymo blog post hit the top of HN today showing their World Model — 2D video in, LiDAR-quality 3D scene out. 822 points, hundreds of comments about the implications.

While reading the thread, a thought: Apple ships an open-source model called SHARP that does something similar. Single image in, 3D Gaussian splat out. Runs on your Mac's GPU. 8 seconds.

Nobody had connected SHARP's output to a proper renderer yet. So I did.

## The Pipeline

```
iPhone photo (any photo)
    ↓ 8 seconds on M4 Mac
Apple SHARP (open-source, Metal-accelerated)
    ↓
3D Gaussian splat (.ply file, ~63MB, 1.1M points)
    ↓
MetalSplatter (open-source Swift/Metal renderer)
    ↓
Rendered 3D scene you can orbit around
```

The input was a single photo of the NYC skyline from Top of the Rock. The output is a 3D scene with actual depth — you can orbit the camera and see buildings at different distances, the sky receding behind them, parallax between the foreground towers and the distant waterfront.

## What's Actually Happening

A Gaussian splat file is a point cloud where each point isn't a pixel — it's a **3D Gaussian ellipsoid**. Each of the 1.1 million points has:

- **Position** (x, y, z) — where in 3D space
- **Color** (spherical harmonics) — what color, from any viewing angle
- **Opacity** — how transparent
- **Scale** (3 axes) — how big the blob is
- **Rotation** (quaternion) — which way the blob is oriented

macOS Preview.app shows scattered dots because it draws each point as a single pixel. MetalSplatter renders the full pipeline: sort all splats back-to-front, project each 3D ellipsoid as a 2D ellipse, alpha-composite them together. The result looks like a continuous image from the original viewpoint, but you can orbit and the depth is real.

SHARP's trick is inferring all of this from a **single 2D image** — no stereo pair, no video, no LiDAR. A neural network trained on millions of 3D scenes predicts the depth, scale, and orientation of every splat in one forward pass. On M4 Mac with Metal acceleration, that pass takes about 8 seconds.

## What I Learned

**Hashimoto gate matters.** My first attempt was building a custom web viewer before verifying the output. It didn't work. The thing that actually validated the pipeline? A 10-line matplotlib render that showed the 3D point cloud structure in 3 projections. Manual walkthrough before automation.

**PLY is an intermediate format, not a destination.** The Gaussian splat PLY that SHARP outputs is not what Vision Pro understands. The rendering chain is: PLY → Metal shader pipeline → screen. MetalSplatter handles that bridge. For visionOS, it renders in stereo via amplification.

**Apple's Photos app already does basic photo→spatial** in visionOS 2.6. The differentiation for any app built on this pipeline would need to be in what Apple *doesn't* do — effects, workflows, batch processing, domain-specific tools.

## The Waymo Connection

This morning's HN thread was about Waymo's World Model — a generative system that "dreams" consistent 3D driving scenarios, including situations their fleet never observed. Traditional self-driving was discriminative ("label this pixel as road"). The World Model is generative ("imagine what happens if I turn left").

SHARP is the same ideology, frozen in one frame. It's a **static world model**. Given a single photo, it dreams the depth, the occluded sides of buildings, the structure you can't see. When you orbit the camera in MetalSplatter, you're seeing SHARP's hallucination of what's behind the edges.

This distinction is what makes it brilliant for creative use — and kills it for anything requiring accuracy.

## The Gauntlet: What Survives

I started with 6 MVP ideas. After stress-testing each against one question — "what's the weakest assumption that kills this?" — three survived:

**KILLED:**
- **Real Estate Walkthrough** — hallucinated depth ≠ real dimensions. "Will my couch fit?" requires ground truth, not AI guesses.
- **Accident Reconstruction** — a generative model that invents the depth of a crushed bumper is inadmissible in court.
- **Structural Engineering** — a crack in a splat could be a texture artifact. Too dangerous for bridge safety.

**SURVIVED:**
- **Inception Mode (95/100)** — fold, shatter, mirror any photo in 3D. Apple will never ship "fold your grandma" in native Photos. Works now. 20 lines of numpy per effect.
- **Historical Dioramas (75/100)** — old photos → volumetric 3D. Apple's Spatial Photos is 2.5D (paper cutout edges). Gaussian splats are genuinely volumetric. Hallucination is a *feature* here — it fills in what the camera never saw.

The generative nature of the model is a feature for creative/experiential use and a liability for utility/measurement. The pivot: drop enterprise, go creative. A reality distortion engine, not a measurement tool.

## What's Next

Two features, one app:
- **Reality Bend** — any photo → Inception effects in spatial 3D
- **Time Travel** — historical photos → volumetric 3D dioramas

All from a single photo and 8 seconds of compute.

## Tools Used

- [Apple SHARP](https://machinelearning.apple.com/research/sharp-monocular-view) — single image → 3D Gaussian splat (open-source, Metal)
- [MetalSplatter](https://github.com/scier/MetalSplatter) — Gaussian splat renderer for iOS/macOS/visionOS (open-source, Swift/Metal)
- Python 3.13 + numpy — for data validation and transforms
- M4 Mac — all processing local, no cloud

## References

- [Waymo World Model](https://news.ycombinator.com/item?id=46914785) — HN thread that started this
- [SHARP paper](https://machinelearning.apple.com/research/sharp-monocular-view) — Apple ML Research
- [MetalSplatter on App Store](https://apps.apple.com/us/app/metalsplatter/id6476895334)
- [3D Gaussian Splatting paper](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/) — the original technique
