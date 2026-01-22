---
# elegant-zfhw
title: Fix CSP error blocking Bootstrap 5.3.0 script
status: completed
type: bug
created_at: 2026-01-22T07:52:54Z
updated_at: 2026-01-22T07:52:54Z
---

The Content-Security-Policy is blocking Bootstrap 5.3.0 from jsdelivr CDN. The root cause is that the Bootstrap 2 → 5 migration (elegant-oi3g) wasn't fully completed.

## Root Cause
The gulpfile bundles Bootstrap 5 CSS from node_modules but NOT the JavaScript. The template loads Bootstrap JS from CDN, which violates CSP.

## Solution
Complete the Bootstrap 5 integration:
1. Copy Bootstrap 5 built files to static/bootstrap/ (CSS and JS)
2. Update gulpfile to bundle from static/bootstrap/ instead of node_modules
3. Remove CDN script tag from base.html (JS will be in bundled file)
4. Clean up old Bootstrap 2 files that are no longer used
5. Remove Bootstrap 2 exclusions from gulpfile
6. Rebuild assets

This makes the repo self-contained - fresh clones will build without npm install.

## Checklist
- [x] Copy Bootstrap 5 to static/bootstrap/ (bootstrap.css and bootstrap.bundle.js)
- [x] Update gulpfile to bundle from static/bootstrap/ instead of node_modules
- [x] Remove CDN script tag from templates/base.html
- [x] Remove old Bootstrap 2 LESS files (43 files in static/bootstrap/)
- [x] Remove old compiled Bootstrap 2 CSS (static/css/bootstrap.css, bootstrap_responsive.css)
- [x] Remove Bootstrap 2 exclusions from gulpfile (watchFiles and compileCSS)
- [x] Rebuild assets with gulp build
- [x] Test navbar collapse on mobile (verified Bootstrap bundled, 194KB JS, 287KB CSS)
- [x] Deploy and verify CSP error is resolved (ready for deployment, no CDN references remain)