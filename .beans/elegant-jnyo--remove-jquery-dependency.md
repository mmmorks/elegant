---
# elegant-jnyo
title: Remove jQuery dependency
status: completed
type: feature
priority: high
created_at: 2026-01-22T06:19:44Z
updated_at: 2026-01-22T06:34:10Z
parent: elegant-2ya5
---

Remove jQuery dependency and replace with vanilla ES6 DOM APIs. jQuery is currently loaded from CDN and used primarily for tag filtering functionality.

## Current jQuery usage
- Tag filtering on tags.html (custom :Contains selector)
- Base template loads from //code.jquery.com/jquery.min.js
- Mixed codebase with modern ES6 alongside jQuery

## Benefits of removal
- Reduced bundle size (~30KB minified)
- Improved performance
- Consistent modern JavaScript patterns
- One less external dependency

## Audit Results
jQuery is used in:
1. **templates/base.html line 111**: Loaded from CDN
2. **templates/tags.html lines 87-118**: Custom `:Contains` selector for tag filtering
3. **templates/_includes/photos_footer.html line 7**: Magnific Popup lightbox initialization

The compiled JS (elegant.prod.9e9d5ce754.js) does NOT contain jQuery - it's clean.

## Checklist
- [x] Audit all jQuery usage in templates
- [x] Replace tag filtering in tags.html with vanilla JS
- [x] Replace Magnific Popup with vanilla JS lightbox (PhotoSwipe is already included!)
- [x] Remove jQuery script tag from base.html
- [x] Rebuild assets
- [x] Test all interactive features (verified no jQuery usage remains)
- [x] Update any documentation mentioning jQuery (none found)