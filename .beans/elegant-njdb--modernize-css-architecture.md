---
# elegant-njdb
title: Modernize CSS architecture
status: todo
type: feature
priority: normal
created_at: 2026-01-22T06:20:20Z
updated_at: 2026-01-22T06:20:20Z
parent: elegant-2ya5
---

Restructure CSS from 25 separate files with LESS compilation to a modern, maintainable architecture using SCSS or modern CSS features.

## Current architecture
- 25 separate CSS files bundled together
- Bootstrap 2 LESS source (43 files) compiled via recess tool
- Mixed old LESS syntax with modern PostCSS
- Manual concatenation in build process

## Proposed improvements
- Consolidate related styles
- Use CSS Modules for component scoping
- Implement CSS layers (@layer) for cascade control
- Migrate LESS → SCSS or modern CSS with nesting
- Better organization with 7-1 pattern or similar

## Benefits
- Easier to maintain and navigate
- Better encapsulation
- Clearer cascade control
- Reduced build complexity
- Modern CSS features (nesting, @scope, etc.)

## Checklist
- [ ] Audit current CSS files and dependencies
- [ ] Design new CSS architecture
- [ ] Choose SCSS vs modern CSS with PostCSS
- [ ] Create migration plan for LESS → new system
- [ ] Implement CSS layers for cascade management
- [ ] Refactor and consolidate stylesheets
- [ ] Update build configuration
- [ ] Test all styles and components
- [ ] Document new CSS structure