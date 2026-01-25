---
# elegant-xo4p
title: Fix plugin CSS for dark/light mode compatibility
status: in-progress
type: task
priority: normal
created_at: 2026-01-25T23:17:05Z
updated_at: 2026-01-25T23:17:56Z
---

Update CSS for all plugins (stork search, commentbox, etc.) to work properly with both dark and light modes. Ensure proper theming and color schemes are applied based on the active mode.

## Checklist

- [x] Fix Stork search CSS to respond to `[data-bs-theme="dark"]` instead of `@media (prefers-color-scheme: dark)`
- [x] Update `stork-dark.css` selectors from `body:not(.stork-multitheme)` to `[data-bs-theme="dark"]`
- [x] Remove media query from Stork CSS link in `base.html`
- [x] Add dynamic theming support to CommentBox.io with `backgroundColor` and `textColor` options
- [x] Add theme change observer for CommentBox to reload on theme switch
- [x] Add dynamic theme switching support to Utterances via iframe postMessage API