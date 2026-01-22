---
# elegant-l83m
title: Upgrade build system to modern bundler
status: todo
type: feature
priority: normal
created_at: 2026-01-22T06:20:10Z
updated_at: 2026-01-22T06:20:10Z
parent: elegant-2ya5
---

Replace Gulp-based build system with a modern bundler like Vite, esbuild, or Parcel. Current Gulp 5 setup works but modern tools offer better performance and DX.

## Current build system
- Gulp 5 with ES modules (gulpfile.mjs)
- PostCSS for CSS processing
- Babel for JS transpilation
- Manual LESS compilation for Bootstrap 2
- File-based cache busting with hardcoded hashes
- browser-sync for dev server

## Modern alternatives
1. **Vite** - Fast HMR, excellent dev experience, good Pelican integration
2. **esbuild** - Extremely fast, simple config
3. **Parcel** - Zero-config, automatic

## Benefits
- Faster builds and dev server
- Better HMR (Hot Module Replacement)
- Automatic code splitting
- Dynamic cache busting
- Modern dev experience

## Checklist
- [ ] Evaluate Vite, esbuild, and Parcel
- [ ] Choose bundler based on Pelican workflow
- [ ] Migrate Gulp tasks to new bundler
- [ ] Configure PostCSS integration
- [ ] Set up dev server with live reload
- [ ] Implement automatic cache busting
- [ ] Test build output
- [ ] Update documentation and contributing guide