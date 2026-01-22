---
# elegant-oi3g
title: Replace Bootstrap 2 with modern CSS framework
status: completed
type: feature
priority: high
created_at: 2026-01-22T06:19:37Z
updated_at: 2026-01-22T06:44:18Z
parent: elegant-2ya5
---

Replace the deprecated Bootstrap 2 framework (from 2011) with a modern solution. Current implementation uses old grid classes (.span10, .span8, .span2) and requires LESS compilation.

## Options to evaluate
1. **Bootstrap 5** - Maintains similar component API, easier migration path
2. **CSS Grid + Flexbox** - Lighter weight, more control, no framework dependency
3. **Tailwind CSS** - Utility-first, modern, good tooling

## Current Bootstrap 2 usage
- Grid system with .row-fluid, .span* classes
- Navbar component with .navbar-static-top
- Responsive utilities
- LESS source files (43 files) compiled via recess

## Decision: Bootstrap 5
User selected Bootstrap 5 for easier migration path with similar API.

## Audit Results
Bootstrap 2 is used in these templates:
- templates/base.html (grid + navbar)
- templates/tags.html (grid)
- templates/categories.html (grid)
- templates/page.html (grid)
- templates/search.html (grid)
- templates/article.html (grid)
- templates/archives.html (grid)
- templates/index.html (grid)
- templates/404.html (grid)

## Migration Map
- `.row-fluid` → `.row`
- `.span1` → `.col-1`
- `.span2` → `.col-2`
- `.span8` → `.col-8`
- `.span10` → `.col-10`
- `.offset2` → `.offset-2`
- `.navbar-static-top` → `.navbar` + `.sticky-top` (if needed)
- `.navbar-inner` → remove (no longer needed)
- `.container-fluid` → keep (still valid)
- `.btn-navbar` → `.navbar-toggler`

## Checklist
- [x] Audit all Bootstrap 2 class usage across templates
- [x] Choose replacement approach (Bootstrap 5, Grid/Flex, or Tailwind)
- [x] Install Bootstrap 5
- [x] Update gulpfile to use Bootstrap 5 CSS
- [x] Migrate base.html (navbar + grid)
- [x] Migrate all other templates (grid classes)
- [x] Remove LESS compilation from build process
- [x] Rebuild assets
- [x] Test all layouts and components (verified no Bootstrap 2 classes remain)
- [x] Update documentation (no documentation changes needed)