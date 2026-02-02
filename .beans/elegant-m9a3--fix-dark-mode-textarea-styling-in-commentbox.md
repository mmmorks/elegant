---
# elegant-m9a3
title: Fix dark mode textarea styling in commentbox
status: completed
type: bug
priority: normal
created_at: 2026-01-26T07:04:32Z
updated_at: 2026-01-26T07:10:20Z
---

The textarea in the comment box doesn't have dark mode styling applied, making it appear light even in dark mode.

## Investigation

Reviewed the CommentBox.io source code on GitHub to understand how theming works. Found that:

1. CommentBox.io runs in an iframe, so regular CSS cannot affect it
2. Only three color options are supported and passed to the iframe:
   - `backgroundColor` → becomes `background_color` query param
   - `textColor` → becomes `text_color` query param
   - `subtextColor` → becomes `subtext_color` query param
3. These parameters are sent to the CommentBox.io service's iframe via query string
4. The iframe content and styling is controlled entirely by CommentBox.io

## Resolution

- Removed invalid `buttonColor` option from our configuration (not supported by CommentBox.io)
- Added documentation comments explaining the limitation
- **Limitation**: The textarea styling inside the CommentBox.io iframe is controlled by their service. If the textarea doesn't properly respect the `backgroundColor` and `textColor` parameters, this is a limitation of CommentBox.io's implementation that we cannot fix from our side.

We are correctly passing all available theme parameters. Any remaining styling issues are on CommentBox.io's end.