---
# elegant-p9er
title: Fix hardcoded link colors in dark mode
status: completed
type: bug
priority: normal
created_at: 2026-02-02T02:44:19Z
updated_at: 2026-02-02T02:46:46Z
---

The `links.css` file uses hardcoded colors that don't adapt to dark mode:

## Problem
- Article body links use `color: black` directly instead of `var(--elegant-text-color)`
- Hover state uses `color: royalblue` instead of `var(--elegant-link-color)`
- The silver underline (`background: silver`) lacks contrast in dark mode

## Files affected
- `static/css/utilities/links.css`

## Solution
Replace hardcoded colors with CSS custom properties:
- `black` → `var(--elegant-text-color)`
- `royalblue` / `dodgerblue` → `var(--elegant-link-color)` or a new hover variant
- `silver` → `var(--elegant-border-color)` or a new underline variable



## Summary of Changes

Added new CSS variables in `variables.css`:
- `--elegant-link-hover-color`: `#1e90ff` (light) / `#87cefa` (dark)
- `--elegant-link-underline-color`: `silver` (light) / `#6c757d` (dark)

Updated `links.css` to use CSS variables:
- `color: black` → `var(--elegant-text-color)`
- `color: royalblue` → `var(--elegant-link-color)`
- `color: dodgerblue` → `var(--elegant-link-hover-color)`
- `background: silver` → `var(--elegant-link-underline-color)`
- `background: dodgerblue` → `var(--elegant-link-hover-color)`
