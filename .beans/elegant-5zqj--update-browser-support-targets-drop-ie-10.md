---
# elegant-5zqj
title: Update browser support targets (drop IE 10)
status: in-progress
type: feature
priority: high
created_at: 2026-01-22T06:20:00Z
updated_at: 2026-01-22T06:23:47Z
parent: elegant-2ya5
---

Remove IE 10 support and update browserslist to modern standards. IE 10 reached end-of-life in 2016, and supporting it prevents using modern CSS/JS features.

## Current state
- package.json includes 'IE 10' in browserslist
- Babel config targets ES2015 + IE 10
- PostCSS autoprefixer generates IE 10 prefixes
- Limits use of modern CSS features

## Proposed targets
- Last 2 versions of major browsers
- Firefox ESR
- Not dead
- > 0.2% market share

## Benefits
- Access to modern CSS features (Grid, custom properties, etc.)
- Smaller transpiled bundle sizes
- Fewer polyfills needed
- Simpler development

## Checklist
- [x] Update browserslist in package.json
- [x] Update Babel config targets
- [x] Review and remove IE-specific workarounds
- [ ] Test in target browsers (manual testing required)
- [x] Update documentation with supported browsers
- [x] Regenerate compiled assets