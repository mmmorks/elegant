---
authors: Talha Mansoor
Title: Customize Style
Tags: unique
Date: 2019-07-03 20:14
Slug: customize-style
Category: Advanced Features
---

To customize Elegant's visual style, you have several options:

## Option 1: Add Custom CSS to Your Site

Create a `custom.css` file in your Pelican site's static directory (not the theme directory):

    :::bash
    your-site/content/static/css/custom.css

Then reference it in your Pelican configuration:

    :::python
    STATIC_PATHS = ['static']
    CUSTOM_CSS = 'static/css/custom.css'

The `CUSTOM_CSS` setting tells Elegant where to find your custom stylesheet. The path should match where the file will be in your output directory.

When you add `'static'` to `STATIC_PATHS`, Pelican copies files from `content/static/` to `output/static/` preserving the directory structure. So `content/static/css/custom.css` becomes `output/static/css/custom.css`, which matches the `CUSTOM_CSS` path.

If you don't set `CUSTOM_CSS`, no custom stylesheet will be loaded.

## Option 2: Modify Theme Source Files

Elegant uses a modular CSS architecture with organized files in `static/css/`:

- `base/variables.css` - CSS custom properties and design tokens
- `base/typography.css` - Font styles and text formatting
- `layout/` - Page structure components
- `components/` - Reusable UI elements
- `themes/dark-mode.css` - Dark mode color overrides

Find the relevant CSS file for what you want to customize, edit it, and rebuild the theme using `npm run build`.

Let's take a look how you can change the style of hyperlinks in an article.
Following is the relevant code,

    :::css
    article p:not(#list-of-translations):not(#post-share-links) a,
    article ol a,
    article div.article-content ul:not(.articles-timeline):not(.related-posts-list) a {

        border-bottom: thin dashed #A9A9A9;
        color: #000;
    }

Copy and paste it in `custom.css`. Change color to red for example,

    :::css
    article p:not(#list-of-translations):not(#post-share-links) a,
    article ol a,
    article div.article-content ul:not(.articles-timeline):not(.related-posts-list) a {

        border-bottom: thin dashed #A9A9A9;
        color: red;
    }

Test your website using Pelican. All links should be colored red.

Read [this post]({filename}../Supported Plugins/assets-plugin.md) to make sure your site's page
speed does not decrease due to additional HTTP request.
