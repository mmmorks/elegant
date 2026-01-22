---
# elegant-k3ek
title: Add modern image handling
status: todo
type: feature
priority: normal
created_at: 2026-01-22T06:20:29Z
updated_at: 2026-01-22T06:20:29Z
parent: elegant-2ya5
---

Implement modern image optimization techniques including lazy loading, modern formats (WebP/AVIF), and responsive images.

## Current state
- No lazy loading
- No WebP or AVIF support
- No responsive image markup (srcset)
- PhotoSwipe gallery uses standard img tags

## Improvements to implement
- Native lazy loading with loading='lazy'
- WebP/AVIF with fallbacks using <picture>
- Responsive images with srcset and sizes
- Aspect ratio boxes to prevent layout shift
- Optional: automatic image optimization in build

## Benefits
- Faster page loads
- Better Core Web Vitals scores
- Reduced bandwidth usage
- Better mobile experience

## Checklist
- [ ] Add loading='lazy' to article images
- [ ] Create <picture> element macro for modern formats
- [ ] Implement srcset for responsive images
- [ ] Add aspect-ratio CSS to prevent layout shift
- [ ] Update gallery templates
- [ ] Test across different devices and connections
- [ ] Document image best practices for content authors