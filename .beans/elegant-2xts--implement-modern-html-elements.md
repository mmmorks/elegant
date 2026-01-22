---
# elegant-2xts
title: Implement modern HTML elements
status: todo
type: feature
priority: normal
created_at: 2026-01-22T06:20:36Z
updated_at: 2026-01-22T06:20:36Z
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
- [ ] Replace category accordion with <details>/<summary>
- [ ] Replace comment collapse with <details>/<summary>
- [ ] Implement <dialog> for any modals
- [ ] Add native form validation attributes
- [ ] Audit semantic HTML usage
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Update CSS for new elements