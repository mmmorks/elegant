---
# elegant-pl15
title: Diagnose and fix Bootstrap 5 layout issues
status: completed
type: bug
priority: normal
created_at: 2026-01-22T06:54:07Z
updated_at: 2026-01-22T06:56:36Z
---

After migrating from Bootstrap 2 to Bootstrap 5, layout issues remain. The migration missed some old Bootstrap 2 classes and didn't add responsive breakpoints to all templates.

## Issues Found

### 1. Old Bootstrap 2 .span* classes still present
- **article.html**: Lines 50, 56, 115 - `.span2` and `.span8` in table of contents conditional
- **page.html**: Lines 33, 39 - `.span2` and `.span8` in table of contents conditional  
- **404.html**: Line 24 - `.span12` on search input element

### 2. Missing responsive breakpoints in index.html
- Lines 41, 52, 67, 87 - Using `col-10 offset-2`, `col-8 offset-2` without mobile-first responsive classes
- Lines 43, 54, 69, 89 - Conditional classes using `col-12`, `col-8`, `col-4` without responsive breakpoints

## Solution

### Bootstrap 2 to Bootstrap 5 conversions:
- `.span2` → `.col-12 col-md-2`
- `.span8` → `.col-12 col-md-8`
- `.span12` → `.form-control` (for input elements)

### Index.html responsive conversions:
- `col-10 offset-2` → `col-12 col-md-10 offset-md-2`
- `col-8 offset-2` → `col-12 col-md-8 offset-md-2`
- `col-8` → `col-12 col-md-8`
- `col-4` → `col-12 col-md-4`
- `col-12` → `col-12` (already correct)

## Checklist
- [x] Fix article.html table of contents layout
- [x] Fix page.html table of contents layout
- [x] Fix 404.html search input class
- [x] Fix index.html responsive breakpoints
- [x] Rebuild assets
- [x] Test responsive behavior