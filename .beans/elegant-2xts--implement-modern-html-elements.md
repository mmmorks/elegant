---
# elegant-2xts
title: Implement modern HTML elements
status: completed
type: feature
priority: normal
created_at: 2026-01-22T06:20:36Z
updated_at: 2026-01-25T23:06:10Z
parent: elegant-2ya5
---

Replace legacy UI patterns with modern HTML elements like <details>, <dialog>, and native form validation.

## Current patterns to modernize
- Checkbox-hack accordions (categories, comments)
- Custom modal overlays
- Manual form validation with JavaScript
- Div-based semantic structures

## Modern replacements
- <details>/<summary> for accordions (categories, collapsible comments)
- <dialog> for modals and overlays
- Native HTML5 form validation
- Better semantic HTML throughout

## Benefits
- Better accessibility out of the box
- Less JavaScript needed
- Native keyboard navigation
- Simpler, more maintainable code
- Better SEO

## Checklist
- [x] Replace category accordion with <details>/<summary>
- [x] Replace comment collapse with <details>/<summary>
- [x] Implement <dialog> for any modals (no custom modals found - only third-party libraries)
- [x] Add native form validation attributes (404 search, mailchimp form)
- [x] Audit semantic HTML usage (added <main>, <article> elements)
- [x] Test keyboard navigation
- [x] Test screen reader compatibility
- [x] Update CSS for new elements