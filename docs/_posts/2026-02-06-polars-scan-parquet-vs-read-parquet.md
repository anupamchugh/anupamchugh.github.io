---
title: "polars scan_parquet is 8-11x faster than read_parquet for filtered queries"
date: '2026-02-06T22:00:00.000Z'
categories: [notes]
keywords: [polars, parquet, performance, rust, lazy-evaluation, predicate-pushdown]
slug: /polars-scan-parquet-vs-read-parquet
type: note
published: true
---

`pl.read_parquet()` loads the entire file into memory, then filters in Python. `pl.scan_parquet()` builds a query plan and pushes predicates down to the Parquet row-group metadata -- Polars' Rust engine skips entire row groups that can't match, reads only the columns you select, and never materializes what you don't need.

benchmarked on a 500K row / 17 MB parquet file (20 runs, median):

| pattern | read_parquet | scan_parquet | speedup |
|---------|-------------|-------------|---------|
| `.tail(300)` | 5.5 ms | 0.6 ms | **8.6x** |
| `.filter(datetime > cutoff)` | 5.8 ms | 0.5 ms | **10.9x** |
| `.select(['datetime','close'])` | 5.6 ms | 2.0 ms | **2.7x** |
| `.filter() + .select()` | 5.8 ms | 0.6 ms | **9.6x** |

the gap widens with file size. at 10 GB, `read_parquet` hits swap; `scan_parquet` stays flat because it only reads matching row groups. Robin van den Brink [demonstrated](https://r-brink.medium.com/working-with-large-datasets-300m-on-a-tiny-machine-512mb-ram-1-core-6d1553e474df) 300M rows on 512 MB RAM using this + `streaming=True` + `sink_parquet`.

the fix is always the same 3-line change:

```python
# before: loads entire file, filters after
df = pl.read_parquet("data.parquet")
df = df.filter(pl.col("datetime") >= cutoff)

# after: pushes filter into the reader
df = (
    pl.scan_parquet("data.parquet")
    .filter(pl.col("datetime") >= cutoff)
    .collect()
)
```

why it works: Parquet stores column statistics (min/max) per row group in the file footer. `scan_parquet` reads the footer first, skips row groups where `max(datetime) < cutoff`, and only decompresses matching groups. `read_parquet` can't do this because by the time your `.filter()` runs, the bytes are already in RAM.

this is the same optimization databases have done for decades (index scans, predicate pushdown, projection pruning). Polars brings it to flat files via its Rust query engine -- your Python code builds the plan, Rust executes it with zero GIL involvement.
