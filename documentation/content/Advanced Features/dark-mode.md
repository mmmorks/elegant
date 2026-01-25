---
authors: Claude Sonnet 4.5
Title: Dark Mode Toggle
Tags: customization, theme, dark-mode
Date: 2026-01-25
Slug: dark-mode
Category: Advanced Features
---

Elegant theme includes a built-in dark/light mode switcher that respects user preferences and system settings.

## Features

- **Three-mode toggle**: Auto (system preference) → Light → Dark → Auto
- **Persistent preference**: Stores user choice in browser localStorage
- **System preference detection**: Automatically follows OS dark mode setting when in "auto" mode
- **Bootstrap 5 integration**: Uses native Bootstrap 5.3+ dark mode support
- **Icon-based toggle**: Visual indicator in navbar showing current mode

## Usage

The dark mode toggle button appears in the navigation bar. Click it to cycle through:

1. **Auto mode** (sun/moon icon): Follows system preference
2. **Light mode** (sun icon): Forces light theme
3. **Dark mode** (moon icon): Forces dark theme

Your preference is saved and will be remembered on future visits.

## Implementation

The dark mode feature is implemented using three files:

### JavaScript (`static/js/theme-switcher.js`)
- Manages theme state via localStorage
- Detects system preference using `matchMedia` API
- Applies theme by setting `data-bs-theme` attribute on `<html>` element
- Vanilla JavaScript, no dependencies

### CSS (`static/css/custom.css`)
- Defines CSS variables for light and dark themes
- Uses `[data-bs-theme="dark"]` selectors to override variables
- Theme-specific color definitions for:
  - Background colors
  - Text colors
  - Link colors
  - Border colors
  - Component-specific styling

### Template (`templates/base.html`)
- Includes theme-switcher.js in `<head>` for flash-free loading
- Toggle button in navbar with Bootstrap Icons
- Dark mode CSS for integrated components (e.g., Stork search)

## Customization

To customize dark mode colors, edit `static/css/custom.css`:

    :::css
    /* Light mode (default) */
    :root {
      --elegant-link-color: #3875d7;
      --elegant-bg-color: #fff;
    }

    /* Dark mode overrides */
    [data-bs-theme="dark"] {
      --elegant-link-color: #6db3f2;
      --elegant-bg-color: #212529;
    }

All custom colors use CSS variables, making it easy to adjust the color scheme.

## Architecture Decision: Theme vs Plugin

The dark mode switcher is **intentionally implemented as a theme feature** rather than a separate Pelican plugin. Here's why:

### Why Dark Mode Belongs in the Theme

1. **CSS is theme-specific**: Every theme has different colors, fonts, and spacing. Dark mode must define theme-specific overrides for all these elements.

2. **UI integration requires theme modification**: The toggle button placement and styling are theme-specific. Even with a plugin, the theme would need to provide the UI and styling.

3. **Framework dependency**: This implementation uses Bootstrap 5.3+'s native `data-bs-theme` attribute and Bootstrap Icons. Not all Pelican themes use Bootstrap.

4. **Standard web development practice**: Modern frameworks (Tailwind, Material-UI, Bootstrap) treat dark mode as a core theme concern, not an add-on.

5. **Simpler maintenance**: All dark mode code lives in one place (the theme), making it easier to understand, customize, and maintain.

### Could It Be a Plugin?

Technically yes, but it would:
- Still require substantial theme work (CSS variables, colors, UI integration)
- Add plugin dependency for a theme-specific feature
- Reduce customization flexibility
- Increase complexity without clear benefits

### For Theme Developers

If you want to add similar dark mode functionality to your Pelican theme:

1. **Core files to adapt**:
   - `theme-switcher.js` - Framework-agnostic, reusable as-is
   - CSS variables - Define your theme's color palette
   - Toggle button HTML - Match your navbar structure

2. **For Bootstrap themes**: Use the `data-bs-theme` attribute approach shown here

3. **For other frameworks**: Adapt the CSS to use class-based switching (e.g., `.dark` class on `<html>`)

4. **Key considerations**:
   - Load theme script in `<head>` to prevent flash of wrong theme
   - Use localStorage for persistence
   - Respect `prefers-color-scheme` media query
   - Ensure adequate contrast ratios for accessibility

## Dependencies

- Bootstrap 5.3.8+ (native dark mode support via `data-bs-theme`)
- Bootstrap Icons 1.11.3+ (for toggle button icons)
- Modern browser with CSS custom properties support

## Browser Support

Works in all modern browsers that support:
- CSS custom properties (CSS variables)
- localStorage API
- matchMedia API for system preference detection

## Related Documentation

- [Customize Style]({filename}./custom-style.md) - General theme customization
- [Custom Syntax Theme]({filename}../Components/custome-syntax-theme.md) - Code highlighting themes
