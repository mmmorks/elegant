---
# elegant-3lsf
title: Fix CSP error blocking commentbox.io script
status: completed
type: bug
created_at: 2026-01-22T08:10:26Z
updated_at: 2026-01-22T08:10:26Z
---

Content-Security-Policy blocks commentbox.io from unpkg.com CDN. Fixed by downloading commentBox.min.js (2.1.0) and bundling it into elegant.prod.js.

## Solution
1. Downloaded commentBox.min.js (33KB, pre-built with qs dependency bundled) to static/commentbox/
2. Load as separate script tag (UMD modules don't bundle well together)
3. Removed CDN script tag, replaced with local path
4. Pelican copies static/commentbox/ to theme output

## Result
- No CDN dependencies for commentbox
- CommentBox 2.1.0 served locally from theme/commentbox/
- CSP error resolved
- commentBox function properly exposed globally