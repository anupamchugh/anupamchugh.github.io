# Banteg: Resurrecting Crimsonland

Source: https://banteg.xyz/posts/crimsonland/
Published: 2026-02-01

## Core Idea
Reverse-engineer and fully recreate the 2003 top-down shooter Crimsonland with exact behavioral fidelity to the GOG classic v1.9.93 (Feb 2011 build). The executable is treated as the spec.

## Non-Negotiables (from the post)
- Full fidelity to GOG classic v1.9.93 behavior, including bugs.
- No guessing: every function tied to decompiled code or runtime evidence.
- No dependency on original runtime; assets OK, all code rewritten.

## Historical Context (quick)
- Freeware 2002 versions; shareware 2003; cult v1.9.8 (Sep 2003).
- Reflexive shutdown 2010; v1.9.93 adds widescreen and becomes GOG bonus.
- Remaster released June 11, 2014 (Steam); later GOG, macOS, Linux, console.

## Technical Notes
- Target binary: DirectX 8.1, VS2003 (VC++ 7.1 SP1), no symbols.
- Engine in grim.dll (grim2d). Exports GRIM__GetInterface -> vtable (84 methods) wrapping D3D8, DirectInput, sprite rendering. Map vtable offsets to name functions (e.g., set_color) and use runtime traces.
- Architecture is heavy on COM/vtable indirection: object -> vtable -> function pointer calls.

## Tooling and Workflow
- Static analysis: IDA, Binary Ninja, Ghidra (headless in devcontainer).
- Ghidra decompile started ~101k lines, later ~114k after missing functions discovered.
- Remove third-party libs by matching signatures (libpng, libjpeg, zlib) and apply headers.
- Maintain name_map.json with evidence for renames and type inference.
- Use coding agents (Codex GPT-5.2) to automate rename/type propagation loops.

## Runtime Analysis
- Windows debugging is required for reliable runtime evidence.
- Windbg/cdb for live breakpoints and callstacks (headless automation).
- Wine stack too layered for faithful introspection.

## Why This Matters
Not a remaster or a "spiritual successor". It is a faithful rewrite that preserves a cult classic exactly, down to quirks and bugs.

---
Date: 2026-02-04
Status: Notes captured
