---
Title: Code Snippets -- Change Theme
Tags: unique
Date: 2019-07-03 20:18
Slug: change-syntax-highlight-theme
Category: Components
authors: Talha Mansoor
---

Elegant uses [Solarized theme](http://ethanschoonover.com/solarized) for syntax
highlighting. To replace it:

1. Edit `static/css/themes/pygments.css` with your preferred theme's CSS
2. Run `npm run build` to rebuild the theme
3. The changes will be bundled into `elegant.prod.css`

Alternatively, you can add your custom syntax highlighting CSS to your site's static directory (see [Customize Style]({filename}../Advanced Features/custom-style.md)).

If you feel like experimenting with different themes then [this
repository](https://github.com/uraimo/pygments-vimstyles) has Pygments CSS of
Vim themes. [This one](https://github.com/richleland/pygments-css) has Pygments
CSS of built-in styles. Do not forget to change `.codehilite` CSS class
identifier to `.highlight`. Code blocks in Pelican generated HTML use
`.highlight` class.
