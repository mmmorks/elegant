Title: Use esbuild and PostCSS To Compile CSS Style Sheets
Tags: postcss, esbuild, development
Category: Contributing
Date: 2019-12-01 23:13
Modified: 2026-01-25 20:20
Slug: use-postcss-to-compile-css-style-sheets
Subtitle: Mandatory
Authors: Talha Mansoor
Summary:
Keywords:

Elegant uses [esbuild](https://esbuild.github.io/) with [PostCSS](https://postcss.org/) to build and process CSS, including [adding vendor prefixes](https://github.com/postcss/autoprefixer), [compressing the CSS file](https://cssnano.co/), and other optimizations.

## Why not use Pelican assets plugin?

[Pelican's assets plugin](https://github.com/getpelican/pelican-plugins/tree/master/assets) uses [Python's webassets package](https://github.com/miracle2k/webassets).

Unfortunately, webassets have not had a release [since early 2017](https://github.com/miracle2k/webassets/releases). Requests to revive the project have [gone unheeded](https://github.com/miracle2k/webassets/issues/505).

I tired to install webassets from the Git repository to use its PostCSS filter but it didn't work. Instead of wasting time in wrestling the code of an unmaintained project, I decided to use PostCSS which is modern and actively maintained.

## How to use esbuild and PostCSS

This is closely related to [LiveReload Elegant Documentation Using esbuild]({filename}./live-reload-esbuild.md)

### Prerequisites

You need to run following steps only once.

#### Step 1: Install NodeJS and Yarn <!-- yaspeller ignore -->

Install [Node.js](https://nodejs.org/en/download/) (version 18 or later) and [Yarn](https://yarnpkg.com/en/docs/install) on your system.

If you are on Windows then try installing them with [scoop.sh](https://scoop.sh/). It saves time and makes update easier.

#### Step 2: Install Dependencies

In the root of the Elegant repository, run

```bash
yarn install
```

`yarn` will create `node_modules` folder in the root.

### Build Commands

In the root of the Elegant repository, run:

```bash
# Production build (minified, hashed)
yarn build

# Development build (sourcemaps, no hashing)
yarn build:dev

# Development server with live reload
yarn dev
```

The production build will compile the CSS from [`static/css`](https://github.com/Pelican-Elegant/elegant/tree/master/static/css) into `static/css/elegant.prod.css`.

## How does it work?

esbuild with PostCSS takes all the CSS files imported in `static/css/main.css`, applies PostCSS plugins (autoprefixer, cssnano, font-magician, RFS), and outputs the compiled version.

For production builds, it outputs `elegant.prod.css` and `elegant.prod.js` with fixed filenames that are referenced directly in templates.

If user has enabled [`assets` plugin]({filename}../Supported Plugins/assets-plugin.md), the CSS file is processed through webassets cssmin filter. This is necessary when combining with [`custom.css`]({filename}../Advanced Features/custom-style.md) to create `style.min.css`.
