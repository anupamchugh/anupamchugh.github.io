# Photos to blog connector

Apple Photos remains the private source of truth. The blog receives only an explicit export.

## Flow

```text
mark Favorites in Photos
  → export-favorite-photos.swift
  → public/photographs/review-inbox/
  → inspect locally
  → copy approved images into best-picks or a named shelf
  → add caption/location/year to lib/photos.ts
  → build and review
  → commit and push
```

Run it from the blog repo:

```bash
swift scripts/export-favorite-photos.swift
```

The exporter is deliberately not a curator. It exports only Photos Favorites, refuses to
download iCloud-only originals, writes a local manifest, and never writes back to Photos.

There is no PhotoKit MCP currently connected. This local bridge is safer for the Photos library:
PhotoKit stays behind macOS permissions, while the approved result can be hosted by GitHub Pages.
