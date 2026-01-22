---
# elegant-2k75
title: Fix Bootstrap 5 grid breakpoints in templates
status: completed
type: bug
priority: high
created_at: 2026-01-22T06:50:19Z
updated_at: 2026-01-22T06:52:40Z
parent: elegant-oi3g
---

The Bootstrap 5 migration used .col-* classes without breakpoint specifiers, causing columns to stack vertically instead of displaying side-by-side on larger screens.

## Problem
Bootstrap 2 used .span* classes that were implicitly responsive. Bootstrap 5's .col-* without breakpoints means "this width at ALL screen sizes", causing unexpected stacking.

## Solution
Update templates to use responsive column classes:
- `.col-1` → `.col-12 col-md-1` (full width mobile, 1 column desktop)
- `.col-10` → `.col-12 col-md-10`
- `.col-8` → `.col-12 col-md-8`
- `.col-2` → `.col-12 col-md-2`
- Offsets: `.offset-2` → `.offset-md-2`

## Files to Update
- templates/base.html
- templates/article.html
- templates/page.html
- templates/tags.html
- templates/categories.html
- templates/archives.html
- templates/index.html
- templates/search.html
- templates/404.html

## Checklist
- [x] Update base.html grid classes
- [x] Update all other templates
- [x] Rebuild CSS
- [x] Test on mmmorks.net site (rebuilt successfully)
- [x] Verify responsive behavior (verified responsive classes in output)