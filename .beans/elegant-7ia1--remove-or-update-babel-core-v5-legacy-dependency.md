---
# elegant-7ia1
title: Remove or update babel-core v5 legacy dependency
status: completed
type: task
priority: normal
created_at: 2026-01-25T22:05:34Z
updated_at: 2026-01-25T22:08:15Z
parent: elegant-ggfz
---

Investigate whether babel-core v5.8.38 can be safely removed since we're using modern @babel/core v7.28.6. If still needed, determine why and document.

## Investigation Findings

**Legacy dependencies found:**
- `babel-core` v5.8.38
- `babel-preset-es2015` v6.24.1

**Modern dependencies in use:**
- `@babel/core` v7.28.6
- `@babel/preset-env` v7.28.6
- `@babel/register` v7.28.6

**Analysis:**
- Neither `babel-core` v5 nor `babel-preset-es2015` v6 are referenced anywhere in the codebase
- The gulpfile.mjs uses modern ES modules and doesn't use Babel for transpilation
- `npm ls` confirms no other packages depend on these legacy packages
- The package.json babel config uses modern `@babel/preset-env`

**Conclusion:** Both legacy packages can be safely removed.

## Checklist

- [x] Search codebase for usage of babel-core
- [x] Check gulpfile for babel references
- [x] Verify no packages depend on legacy babel packages
- [x] Remove babel-core from package.json
- [x] Remove babel-preset-es2015 from package.json
- [x] Run npm install/yarn to update lockfile
- [x] Test build process