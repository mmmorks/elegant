---
# elegant-njdb
title: Modernize CSS architecture
status: completed
type: feature
priority: normal
created_at: 2026-01-22T06:20:20Z
updated_at: 2026-01-26T00:49:08Z
parent: elegant-2ya5
---

Restructure CSS from 25 separate files with LESS compilation to a modern, maintainable architecture using modern CSS features.

## Audit findings

**Current architecture:**
- ✅ Bootstrap 2 LESS already migrated to Bootstrap 5
- 17 theme CSS files in static/css/ (2017 total lines)
- External dependencies: Bootstrap 5, PhotoSwipe, Applause Button
- Build: Gulp + PostCSS (postcss-preset-env stage 1, rfs, cssnano)
- Modern CSS already in use: CSS variables, nesting syntax
- Output: Single concatenated file with hardcoded hash

**File breakdown by size:**
- Large (>100 lines): elegant.css (522), pygments.css (309), stork.css (217), custom.css (211), typography.css (191), admonition.css (153), code.css (102)
- Medium (20-100 lines): links.css (77), blockquote.css (38), code-copy.css (34), stork-dark.css (33), gallery.css (29), permalink.css (20)
- Small (<20 lines): search.css (18), sidebar-social.css (17), applause-button.css (15), sidebar.css (4)

**Issues identified:**
1. Flat file structure with no clear organization
2. No CSS layers for cascade control
3. Mix of concerns (features, components, utilities)
4. Some tiny files (sidebar.css = 4 lines)
5. Hardcoded hash in output filename
6. Duplicate file (applause-button.css in two locations)

## Proposed new architecture

**Structure (modified 7-1 pattern):**
```
static/css/
├── main.css                    # Main entry point with @layer definitions
├── base/
│   ├── variables.css          # CSS custom properties (from custom.css)
│   ├── typography.css         # Font definitions and type styles
│   └── reset.css              # Any custom resets/normalizations
├── layout/
│   ├── grid.css               # Layout structures (from elegant.css)
│   ├── header.css             # Header/navbar (from elegant.css)
│   ├── footer.css             # Footer (from elegant.css)
│   └── sidebar.css            # Sidebar (from elegant.css + sidebar.css)
├── components/
│   ├── articles.css           # Article styles (from elegant.css)
│   ├── tags.css               # Tag clouds (from elegant.css)
│   ├── tables.css             # Tables (from elegant.css)
│   ├── code.css               # Code blocks (from code.css)
│   ├── admonitions.css        # Admonition blocks
│   ├── blockquotes.css        # Blockquote styles
│   ├── comments.css           # Comment sections (from elegant.css)
│   └── forms.css              # Forms like MailChimp (from elegant.css)
├── features/
│   ├── search.css             # Lunr search (from search.css)
│   ├── stork.css              # Stork search widget
│   ├── gallery.css            # Gallery/PhotoSwipe
│   ├── code-copy.css          # Copy to clipboard
│   └── permalink.css          # Permalink styles
├── themes/
│   ├── pygments.css           # Syntax highlighting
│   ├── dark-mode.css          # Dark mode overrides (from custom.css)
│   └── stork-dark.css         # Stork dark theme
├── utilities/
│   └── links.css              # Link utilities
└── vendor/
    # External CSS loaded separately (Bootstrap, PhotoSwipe, etc.)
```

**CSS Layers structure:**
```css
@layer reset, base, layout, components, features, themes, utilities, overrides;
```

## Benefits
- Clear separation of concerns by category
- Better maintainability with logical grouping
- Explicit cascade control via CSS layers
- Easier to locate and modify styles
- Consolidates tiny files into logical groups
- Already using modern CSS (no SCSS migration needed)
- Dynamic cache busting (future improvement)

## Checklist
- [x] Audit current CSS files and dependencies
- [x] Design new CSS architecture
- [x] Choose SCSS vs modern CSS with PostCSS (decision: modern CSS)
- [x] Create main.css entry point with @layer definitions
- [x] Create directory structure
- [x] Migrate and reorganize CSS files:
  - [x] base/ (variables, typography, reset)
  - [x] layout/ (grid, header, footer, sidebar)
  - [x] components/ (articles, tags, tables, code, etc.)
  - [x] features/ (search, gallery, code-copy, permalink)
  - [x] themes/ (pygments, dark-mode, stork-dark)
  - [x] utilities/ (links)
- [x] Update build configuration in gulpfile.mjs
- [x] Test all styles and components
- [x] Document new CSS structure
- [ ] Clean up old CSS files (optional)

## Implementation Summary

Successfully modernized CSS architecture with the following changes:

**New Structure:**
- Created `static/css/main.css` as entry point with CSS @layer definitions
- Organized CSS into 7 categories: base, layout, components, features, themes, utilities, vendor
- 17 source files reorganized from flat structure into logical hierarchy

**Build System:**
- Installed `postcss-import` plugin for processing @import statements
- Updated gulpfile.mjs to use main.css as entry point
- Build still outputs single concatenated file (elegant.prod.9e9d5ce754.css)
- Output size: 337KB minified

**CSS Layers:**
Layer cascade order: `reset < base < layout < components < features < themes < utilities < overrides`

**Benefits Achieved:**
- Clear separation of concerns
- Easier to locate and modify specific styles
- Explicit cascade control via @layer
- No SCSS migration needed (already using modern CSS with nesting)
- Maintains same output format (single bundled file)