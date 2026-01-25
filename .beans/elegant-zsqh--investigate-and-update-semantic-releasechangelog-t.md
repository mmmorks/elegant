---
# elegant-zsqh
title: Investigate and update @semantic-release/changelog to v6
status: completed
type: task
priority: normal
created_at: 2026-01-25T22:05:34Z
updated_at: 2026-01-25T22:12:32Z
parent: elegant-ggfz
---

Update @semantic-release/changelog from 5.0.1 to 6.0.3. This is a major version update - need to review breaking changes and test before updating.

## Investigation Findings

**Current state:**
- `@semantic-release/changelog` v5.0.1 requires `semantic-release` ">=15.8.0 <18.0.0"
- `semantic-release` v25.0.2 is installed
- **This causes a peer dependency conflict!**

**Breaking changes in v6.0.0:**
- Minimum Node.js version raised to v14.17 (currently using v25.4.0 ✓)
- Peer dependency updated to require `semantic-release` ">=18.0.0"
- No API or configuration changes

**Subsequent patch releases:**
- v6.0.1: Updated @semantic-release/error to v3
- v6.0.2: Updated fs-extra to v11
- v6.0.3: Updated fs-extra to v11.1.1

**Conclusion:** Upgrading to v6 will FIX the existing peer dependency warning by supporting semantic-release v25.

## Checklist

- [x] Check Node.js version compatibility
- [x] Review breaking changes
- [x] Verify semantic-release configuration
- [x] Check peer dependency compatibility
- [x] Update package.json to v6.0.3
- [x] Run yarn install
- [x] Verify no new peer dependency warnings

**Result:** Successfully upgraded from v5.0.1 to v6.0.3. The peer dependency warning for semantic-release is now resolved!