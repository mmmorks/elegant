---
# elegant-l83m
title: Upgrade build system to modern bundler
status: completed
type: feature
priority: normal
created_at: 2026-01-22T06:20:10Z
updated_at: 2026-01-26T04:22:57Z
parent: elegant-2ya5
---

Replace Gulp-based build system with esbuild for better performance and simpler configuration.

## Current build system
- Gulp 5 with ES modules (gulpfile.mjs)
- PostCSS for CSS processing (autoprefixer, font-magician, rfs, cssnano)
- Babel for JS transpilation
- File-based cache busting with hardcoded hash `9e9d5ce754`
- browser-sync for dev server
- Integrates with Pelican build (Python invoke)

## Why esbuild?
- Extremely fast (10-100x faster than webpack/parcel)
- Simple configuration
- Perfect for CSS/JS bundling (no SPA complexity needed)
- Native PostCSS support via plugin
- Automatic content hashing (replaces hardcoded hashes)
- Lightweight footprint

## Migration Plan

### Phase 1: Setup & Configuration
- [x] Install esbuild and esbuild-plugin-postcss
- [x] Create esbuild.config.mjs with entry points
- [x] Configure PostCSS plugins (import, preset-env, font-magician, rfs, cssnano)
- [x] Set up output paths and automatic content hashing

### Phase 2: Build Scripts
- [x] Create build script for production (minified, hashed)
- [x] Create build script for development (sourcemaps, watch mode)
- [x] Configure external dependencies (keep vendor libraries separate if needed)
- [x] Test build output matches current production files

### Phase 3: Dev Server
- [x] Integrate esbuild watch mode with browser-sync
- [x] Configure browser-sync to serve documentation/output
- [x] Set up file watchers for Pelican content and templates
- [x] Test live reload functionality

### Phase 4: Template Integration
- [x] Update templates to use dynamic asset paths (remove hardcoded hash)
- [x] Create helper/macro for hashed asset URLs
- [x] Update base.html and other templates that reference CSS/JS
- [x] Ensure cache busting works correctly

### Phase 5: Cleanup & Documentation
- [x] Update package.json scripts (build, dev, css, js)
- [x] Remove Gulp dependencies (gulp, gulp-concat, gulp-postcss, gulp-terser)
- [x] Delete gulpfile.mjs
- [x] Update documentation with new build commands
- [x] Rename live-reload-gulp.md to live-reload-esbuild.md
- [x] Test full build and dev workflow end-to-end