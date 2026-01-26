---
# elegant-4j19
title: Fix CSS build to include all Elegant theme styles
status: completed
type: bug
priority: high
created_at: 2026-01-26T05:05:10Z
updated_at: 2026-01-26T05:15:16Z
parent: elegant-pwnn
---

## Problem

The esbuild CSS build is only including vendor libraries (Bootstrap, PhotoSwipe, Applause Button) but NOT the Elegant theme's modular CSS files from components/, features/, themes/, etc.

## Root Cause

postcss-import doesn't process @import statements that are nested inside @layer blocks in main.css. The @layer syntax was added during CSS modernization but isn't compatible with our build pipeline.

## Solution Approaches

1. **Flatten imports**: Move @import statements outside @layer blocks and handle layering differently
2. **Use different tooling**: Switch from postcss-import to a tool that supports layered imports
3. **Revert to Gulp approach**: Use the original concatenation approach that worked

## Files Involved

- static/css/main.css (entry point with @layer + @import)
- esbuild.config.mjs (build configuration)
- All files in: base/, layout/, components/, features/, themes/, utilities/

## Acceptance Criteria

- [x] elegant.prod.css includes ALL theme CSS (not just vendor libs)
- [x] CSS layers work correctly for specificity control (using `@import layer()` syntax)
- [x] Blog at ../mmmorks.net displays with proper styling
- [x] Build completes without errors

## Solution Implemented

Restructured static/css/main.css to move all @import statements to the top level and use the CSS spec-compliant `@import "file.css" layer(layername);` syntax instead of nesting imports inside @layer blocks. This allows postcss-import to properly resolve all imports while maintaining the layer cascade order.