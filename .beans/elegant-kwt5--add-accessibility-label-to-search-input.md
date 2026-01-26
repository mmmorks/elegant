---
# elegant-kwt5
title: Add accessibility label to search input
status: completed
type: bug
priority: normal
created_at: 2026-01-26T07:52:08Z
updated_at: 2026-01-26T07:52:29Z
---

The search input in the navigation bar lacks a proper label for accessibility. Need to add either a visible <label> element, a title attribute, or aria-label/aria-labelledby.

Found at: templates/base.html:96

Current code:
```html
<input data-stork="sitesearch" class="form-control" placeholder="Search">
```

Solution: Add a visually-hidden label element to maintain the current visual design while providing accessibility for screen readers.