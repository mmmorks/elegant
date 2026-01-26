# Elegant CSS Architecture

This directory contains the CSS source files for the Elegant Pelican theme, organized using a modified 7-1 pattern.

## Directory Structure

```
static/css/
├── main.css                    # Main entry point with @layer definitions
├── base/                       # Foundational styles
│   ├── variables.css          # CSS custom properties (colors, fonts, etc.)
│   └── typography.css         # Font definitions and type scales
├── layout/                     # Page structure
│   ├── grid.css               # Page grid and base structure
│   ├── header.css             # Header and navigation
│   ├── footer.css             # Footer
│   └── sidebar.css            # Sidebar
├── components/                 # Reusable UI components
│   ├── articles.css           # Article content styles
│   ├── tags.css               # Tag clouds and categories
│   ├── tables.css             # Table styles
│   ├── code.css               # Code blocks
│   ├── admonitions.css        # Admonition blocks (warnings, notes, etc.)
│   ├── blockquotes.css        # Blockquote styles
│   ├── comments.css           # Comments section
│   └── forms.css              # Forms (MailChimp, etc.)
├── features/                   # Specific feature implementations
│   ├── search.css             # Lunr search
│   ├── stork.css              # Stork search widget
│   ├── gallery.css            # Gallery/PhotoSwipe
│   ├── code-copy.css          # Copy to clipboard feature
│   └── permalink.css          # Permalink styles
├── themes/                     # Theming and syntax highlighting
│   ├── pygments.css           # Syntax highlighting
│   ├── dark-mode.css          # Dark mode support
│   └── stork-dark.css         # Stork dark theme
└── utilities/                  # Helper classes
    └── links.css              # Link utilities

# Legacy files (still present but not imported):
├── elegant.css                # Old main file (now split across directories)
├── custom.css                 # Old customizations (now in base/ and themes/)
├── typography.css (old)       # Moved to base/typography.css
└── [other old files]          # Kept for reference, not used in build
```

## CSS Layers

The CSS uses `@layer` for explicit cascade control. Layer order (from lowest to highest specificity):

1. **reset** - CSS resets and normalizations
2. **base** - Base styles (variables, typography)
3. **layout** - Page structure and grid
4. **components** - Reusable UI components
5. **features** - Specific feature implementations
6. **themes** - Syntax highlighting and color schemes
7. **utilities** - Helper classes
8. **overrides** - User overrides (reserved for future use)

Styles in later layers override earlier layers, regardless of selector specificity.

## Build Process

The build uses PostCSS with the following plugins:

1. **postcss-import** - Resolves `@import` statements
2. **postcss-preset-env** - Transforms modern CSS (includes autoprefixer)
3. **postcss-font-magician** - Automatic @font-face rules
4. **rfs** - Responsive font sizes
5. **cssnano** - Minification

### Build Commands

```bash
# Build CSS only
npx gulp css

# Build everything (CSS + JS + Pelican)
npx gulp build

# Watch and serve
npx gulp
```

### Build Output

All CSS is bundled into a single minified file: `static/css/elegant.prod.9e9d5ce754.css`

External vendor CSS (Bootstrap, PhotoSwipe, Applause Button) is concatenated separately.

## Adding New Styles

### Where to Add Styles

- **Base styles** (variables, typography) → `base/`
- **Layout changes** (header, footer, grid) → `layout/`
- **New UI components** → `components/`
- **New features** → `features/`
- **Theme/color changes** → `themes/`
- **Utility classes** → `utilities/`

### Steps to Add New CSS

1. Create or edit the appropriate file in the correct directory
2. If creating a new file, add an `@import` statement to `main.css`
3. Place the import in the correct `@layer` section
4. Run `npx gulp css` to rebuild
5. Test your changes

### Example

To add a new component for breadcrumbs:

```css
/* static/css/components/breadcrumbs.css */
/**
 * Components - Breadcrumbs
 */

.breadcrumb {
  /* your styles here */
}
```

Then add to `main.css`:

```css
@import url("components/breadcrumbs.css") layer(components);
```

## Dark Mode

Dark mode is implemented using CSS custom properties (variables) defined in `base/variables.css`.

The theme switches between light and dark modes using the `data-bs-theme` attribute:

```css
:root { /* light mode variables */ }
[data-bs-theme="dark"] { /* dark mode overrides */ }
```

Color variables use the `--elegant-*` prefix and are applied throughout the CSS.

## Modern CSS Features Used

- **CSS Custom Properties** (variables)
- **CSS Nesting** (native CSS nesting, not SCSS)
- **CSS Layers** (@layer)
- **Modern selectors** (:is, :where, etc.)
- **Container queries** (where supported)

## Migration from Old Structure

The old flat structure with 17 CSS files has been reorganized:

- `elegant.css` → Split across `layout/` and `components/`
- `custom.css` → Split into `base/variables.css` and `themes/dark-mode.css`
- `typography.css` → Moved to `base/typography.css`
- Component files → Moved to `components/`
- Feature files → Moved to `features/`

Old files are kept in the root `static/css/` directory for reference but are no longer imported in the build.

## Troubleshooting

### Build Fails

1. Check for syntax errors in CSS files
2. Ensure all `@import` paths in `main.css` are correct
3. Verify `postcss-import` is installed: `npm install --save-dev postcss-import`

### Styles Not Applied

1. Check that the file is imported in `main.css`
2. Verify the `@layer` is correct
3. Clear browser cache
4. Rebuild: `npx gulp css`

### Layer Order Issues

If a style isn't overriding as expected, check the layer order in `main.css`. Later layers have higher specificity.

## Contributing

When contributing CSS changes:

1. Follow the existing directory structure
2. Use CSS custom properties (variables) for colors and repeated values
3. Add comments to explain complex styles
4. Test in both light and dark modes
5. Ensure responsive behavior on mobile devices
6. Run the build before committing
