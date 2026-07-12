---
layout: post
title: "Why Rust CLI Tools Are Faster Than Python (And When It Doesn't Matter)"
date: 2026-02-04
categories: [engineering, performance]
tags: [rust, python, performance, prek, pre-commit]
---

I recently switched from `pre-commit` (Python) to `prek` (Rust) for my trading platform's git hooks. Cold start went from ~4 seconds to ~0.5 seconds. But here's the thing: **Rust isn't magically faster**. Understanding *why* it's faster helped me decide where Rust makes sense and where it doesn't.

## The Airport Security Analogy

Running a Python script is like going through airport security with extra steps:

```
Arrive at airport
  → Wait for security equipment to boot up (Python interpreter)
  → Show passport, get verified (import modules)
  → One X-ray machine, single file line (GIL)
  → Random stops for cleaning (garbage collection)
  → Finally through
```

Running a Rust binary:

```
Arrive at airport
  → Walk straight to pre-warmed checkpoint (native binary)
  → Credentials pre-verified at gate (no runtime imports)
  → Multiple X-ray lanes running in parallel (true concurrency)
  → No cleaning stops (no GC)
  → Through instantly
```

## Where The Time Actually Goes

### 1. Interpreter Startup: ~100-300ms

Every Python invocation loads the interpreter, parses bytecode, and imports the standard library. Pre-commit imports yaml, virtualenv, subprocess, and more. That's overhead before your code even runs.

Rust compiles to a native binary. No interpreter. Zero startup cost.

### 2. Virtual Environment Hell: ~500-2000ms

Pre-commit creates isolated Python environments for each hook:

```
hook-repo-1/ → create venv → pip install → cache
hook-repo-2/ → create venv → pip install → cache
```

Even cached, it validates hashes on every run.

Prek uses `uv` (also Rust-based) which is 10-100x faster than pip for environment setup.

### 3. The GIL Problem

Python's Global Interpreter Lock means only one thread executes Python bytecode at a time. Running 10 hooks? They're essentially sequential.

Rust has no GIL. Prek runs independent hooks in parallel using Rayon.

### 4. Garbage Collection Pauses

Python's GC can pause execution unpredictably. Usually milliseconds, but they add up across thousands of operations.

Rust has no GC. Memory is freed deterministically when ownership ends.

## Concrete Numbers

| Operation | pre-commit | prek | Speedup |
|-----------|------------|------|---------|
| Cold start | ~4s | ~0.5s | 8x |
| Warm start | ~1.5s | ~0.1s | 15x |
| 100 files | Sequential | Parallel | Nx |
| Memory | ~200MB | ~15MB | 13x |

## The Trap: "Rewrite Everything in Rust"

After seeing these gains, I considered rewriting my FastAPI backend in Rust. Then I profiled it:

```
Backend time breakdown:
├── Kite API calls     45%  (network I/O)
├── SQLite queries     25%  (disk I/O)
├── Binance API        15%  (network I/O)
├── Indicator calc     10%  (CPU) ← Already using Polars!
└── Python overhead     5%  (glue code)
```

**90% is I/O-bound.** Rewriting in Rust wouldn't help—I'm waiting on networks and disks, not CPU.

The 10% that's CPU-bound (indicator calculations)? Already using Polars, which is Rust under the hood.

## The Right Approach: Rust at the Edges

Instead of rewriting Python, I use Rust where it matters:

```
┌─────────────────────────────────────────┐
│  PYTHON (FastAPI)                       │
│  API routing, business logic, async I/O │
├─────────────────────────────────────────┤
│  RUST LIBRARIES (Python bindings)       │
│  ├── polars     → DataFrames            │
│  ├── orjson     → JSON parsing (3-10x)  │
│  └── pydantic   → Validation (v2=Rust)  │
├─────────────────────────────────────────┤
│  RUST TOOLS                             │
│  ├── ruff       → Linting               │
│  ├── prek       → Pre-commit            │
│  └── uv         → Package management    │
└─────────────────────────────────────────┘
```

## When Rust Makes Sense

Use Rust when:
- **Startup time matters** — CLI tools run 1000x/day
- **CPU-bound** — Parsing, computation, no waiting on I/O
- **Memory-critical** — Predictable allocation, no GC pauses
- **Parallel-friendly** — Workload can use multiple cores

Don't use Rust when:
- **I/O-bound** — You're waiting on network/disk anyway
- **Rapid iteration** — Rust compile times slow prototyping
- **Glue code** — Python's flexibility is the point
- **No profiled bottleneck** — "It feels slow" isn't a benchmark

## Easy Wins for Python Projects

Before reaching for Rust rewrites, try these:

1. **Switch to orjson** — Drop-in replacement, 3-10x faster JSON
   ```python
   import orjson
   data = orjson.loads(response.text)
   ```

2. **Use Polars instead of Pandas** — Rust-powered DataFrames
   ```python
   import polars as pl
   df = pl.read_parquet("data.parquet")
   ```

3. **Use uvloop** — Rust-based event loop for asyncio
   ```python
   import uvloop
   uvloop.install()
   ```

4. **Use prek/ruff/uv** — Rust CLI tools for development workflow

## Conclusion

Rust is faster than Python for specific workloads: startup-sensitive CLI tools, CPU-bound computation, memory-critical systems. But most web backends are I/O-bound—rewriting them in Rust is premature optimization.

The smart approach: **Python for the API layer, Rust libraries for hot paths, Rust tools for development workflow.**

My trading platform runs FastAPI (Python) + Polars (Rust) + orjson (Rust) + prek (Rust). Best of both worlds: Python's productivity where it matters, Rust's performance where it counts.

---

*Setup: Add prek to your project with `brew install prek && prek install`. Your git commits will be noticeably faster.*
