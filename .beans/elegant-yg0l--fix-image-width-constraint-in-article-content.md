---
# elegant-yg0l
title: Fix image width constraint in article content
status: completed
type: bug
priority: normal
created_at: 2026-01-22T07:26:40Z
updated_at: 2026-01-22T07:27:38Z
---

Images in article content (specifically the spelling bee blog post) are not being constrained to column width. Need to add max-width: 100% and height: auto to .article-content img rules.