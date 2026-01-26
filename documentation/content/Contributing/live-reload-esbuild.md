---
Title: LiveReload Elegant Documentation Using esbuild
Tags: esbuild, development
Date: 2019-07-19 23:17
Modified: 2026-01-25 20:20
Slug: live-reload-elegant-documentation-using-esbuild
Category: Contributing
Authors: Talha Mansoor
---

Elegant uses [esbuild](https://esbuild.github.io/) for fast asset bundling and [BrowserSync](https://www.browsersync.io/) for LiveReload during development. This provides instant feedback when editing templates, CSS, JavaScript, or content files. This is a better alternative to the [Python LiveReload solution that Pelican offers by default]({filename}./live-reload-python.md).

## Prerequisites

You need to run following steps only once, to setup LiveReload.

### Step 1: Install NodeJS and Yarn <!-- yaspeller ignore -->

Install [Node.js](https://nodejs.org/en/download/) (version 18 or later) and [Yarn](https://yarnpkg.com/en/docs/install) on your system.

If you are on Windows then try installing them with [scoop.sh](https://scoop.sh/). It saves time and makes update easier.

### Step 2: Install Dependencies

In the root of the Elegant repository, run

```bash
yarn install
```

`yarn` will create `node_modules` folder in the root.

## Use LiveReload

Run the dev server from the root of the elegant repository:

```bash
yarn dev
```

It will:
1. Build CSS and JavaScript assets with esbuild (in watch mode)
2. Build Pelican documentation
3. Launch BrowserSync and open the home page in your browser

Now when you edit templates, CSS rules, JavaScript files, Markdown, or reStructuredText files, all opened tabs will automatically reload and reflect the change.

It is set to serve the documentation at <http://localhost:9001>.

## Why BrowserSync is better than Python-LiveReload

BrowserSync supports pretty URLs, which [Python-LiveReload doesn't]({filename}./live-reload-python.md#known-issue).

BrowserSync has number of additional powerful features.

### Interaction Sync

This is an extremely powerful and useful feature.

> Your scroll, click, refresh and form actions are mirrored between browsers while you test.

What it means is when you have URL open in more than one tabs or browsers. If you scroll in one tab, other tabs mirror the scroll movement.

You can use this feature to test your website in desktop and mobile widths simultaneously. Open a link in one tab normally, and in other tab in responsive mode.

### Browser Based UI

BrowserSync offers and easy to use UI. To access it, run `gulp`, open <http://localhost:9002/> in your browser.

### Debug CSS

You can add simple and depth CSS outlines to elements, or overlay CSS grid using BrowserSync. Open <http://localhost:9002/remote-debug> in your browser.

### Network Throttle

You can test website on a slower network connection. To access open <http://localhost:9002/network-throttle>

## Build System

Elegant uses [esbuild](https://esbuild.github.io/), a modern JavaScript bundler that's 10-100x faster than traditional tools like Webpack or Gulp. esbuild handles:

- CSS bundling with PostCSS plugins (autoprefixer, cssnano, font-magician, RFS)
- JavaScript concatenation and minification
- Automatic content hashing for cache busting
- Source maps for development

### Available Commands

```bash
# Development server with live reload
yarn dev

# Production build (minified, hashed assets)
yarn build

# Development build (sourcemaps, no minification)
yarn build:dev

# Watch assets only (no server)
yarn watch
```

### Why esbuild?

We migrated from Gulp to esbuild for several reasons:

- **Speed**: esbuild is written in Go and is extremely fast
- **Simplicity**: Less configuration, fewer dependencies
- **Modern**: Native ES modules, better source maps
- **Automatic hashing**: Cache busting without hardcoded hashes

Pelican helper scripts do not watch for file changes. BrowserSync only watches the files it serves (HTML, CSS, JS). The dev server script combines esbuild's watch mode with custom file watchers for Markdown and Jinja2 templates, triggering Pelican rebuilds as needed.
