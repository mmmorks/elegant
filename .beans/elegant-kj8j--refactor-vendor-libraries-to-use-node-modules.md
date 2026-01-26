---
# elegant-kj8j
title: Refactor vendor libraries to use node_modules
status: completed
type: task
priority: normal
created_at: 2026-01-26T06:07:00Z
updated_at: 2026-01-26T06:11:52Z
---

Remove static copies of 3rd-party libraries and install them as npm dependencies. Update build scripts to copy/minify from node_modules. This makes updates easier and follows modern build practices.

## Checklist
- [x] Identify all 3p libraries currently in static/
- [x] Check which are available on npm
- [x] Install missing npm packages
- [x] Update build scripts to copy from node_modules
- [x] Remove static copies
- [x] Test build and verify all assets work
- [x] Update .gitignore if needed