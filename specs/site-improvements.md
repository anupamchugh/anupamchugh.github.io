# Site Improvements Spec

## Status: Planning

## Implemented (v1 - Minimal Design)

- [x] Simple hero with name + tagline
- [x] Single column post listing
- [x] Clean typography (prose styling)
- [x] Minimal animations (removed glow, glass effects)
- [x] Dark theme with slate colors

## Future Enhancements

### Search
- Add client-side search with Fuse.js
- Search posts by title, content, tags
- Keyboard shortcut (Cmd+K) to open search

### Tags System
- Tag pages for each topic (SwiftUI, Core ML, etc.)
- Tag cloud or list on sidebar
- Filter posts by tag

### Reading Progress
- Progress bar at top of article pages
- Estimated reading time

### Table of Contents
- Auto-generated TOC for long articles
- Sticky sidebar on desktop

### Dark/Light Mode Toggle
- System preference detection
- Manual toggle with persistence

### RSS Feed
- Generate RSS feed at build time
- Link in header/footer

### Analytics
- Privacy-friendly analytics (Plausible or Fathom)
- Page views, referrers

### Performance
- Image optimization with next/image
- Lazy loading for images
- Preload critical fonts

### Comments
- GitHub Discussions integration
- Or simple giscus integration

## Design References

- https://mariozechner.at - Pure content-first
- https://www.jlowin.dev - Light gradient, minimal
- Current implementation: Middle ground (dark, single column, no glow)

## Notes

- Keep it simple - only add features that serve the content
- Typography is the design
- Fast load times over fancy effects
