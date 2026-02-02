---
# elegant-u9e2
title: Reverse link hover effect direction
status: completed
type: task
priority: normal
created_at: 2026-02-02T02:44:22Z
updated_at: 2026-02-02T02:47:39Z
---

The current link hover effect in article content is counterintuitive—it removes visual feedback on hover instead of adding it.

## Current behavior
- Resting state: silver underline visible
- Hover state: underline fades out and slides down

## Problem
- Hover effects typically signal interactivity with *more* visual emphasis
- Users may not realize links are clickable until they hover
- The subtle silver underline can be easily missed

## Proposed solution
Invert the animation so the underline animates *in* on hover:
- Resting state: no underline (or very subtle)
- Hover state: underline fades in and slides up into position

## Files affected
- `static/css/utilities/links.css`



## Summary of Changes

Reversed the article link hover animation in `links.css`:

**Before:**
- Resting: underline visible (`opacity: 1`, `translateY(0)`)
- Hover: underline fades out and slides down (`opacity: 0`, `translateY(5px)`)

**After:**
- Resting: no underline (`opacity: 0`, `translateY(5px)`)
- Hover: underline slides up and fades in (`opacity: 1`, `translateY(0)`)

Also changed the underline color from `--elegant-link-underline-color` to `--elegant-link-color` so it matches the hover text color for visual cohesion.

This now matches the conventional UX pattern where hover adds visual feedback to indicate interactivity.
