import * as esbuild from 'esbuild';
import fs from 'fs';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const postcssPlugin = require('esbuild-plugin-postcss2').default;
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import magician from 'postcss-font-magician';
import rfs from 'rfs';

// PostCSS plugins for development (no minification)
const postcssPlugins = [
  postcssImport(),
  postcssPresetEnv({ stage: 1 }),
  magician({}),
  rfs(),
];

// JS files to concatenate (in order)
const jsFiles = [
  'static/bootstrap/bootstrap.bundle.js',
  'static/applause-button/applause-button.js',
  'static/photoswipe/photoswipe.js',
  'static/photoswipe/photoswipe-ui-default.js',
  'static/photoswipe/photoswipe-array-from-dom.js',
  'static/lunr/lunr.js',
  'static/clipboard/clipboard.js',
  'static/js/create-instagram-gallery.js',
  'static/js/copy-to-clipboard.js',
  'static/js/lunr-search-result.js',
];

// Build JavaScript
async function buildJS() {
  const concatenated = jsFiles
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');

  const result = await esbuild.transform(concatenated, {
    sourcemap: 'inline',
    target: ['es2020'],
  });

  fs.writeFileSync('static/js/elegant.dev.js', result.code);
}

// CSS build context for watch mode
const cssContext = await esbuild.context({
  bundle: true,
  sourcemap: true,
  entryPoints: ['static/css/main.css'],
  outfile: 'static/css/elegant.dev.css',
  logLevel: 'info',
  plugins: [
    postcssPlugin({
      plugins: postcssPlugins,
      rootDir: process.cwd(),
    }),
  ],
});

// Initial builds
console.log('🔨 Building assets...');
await cssContext.rebuild();
await buildJS();

// Watch CSS
console.log('👀 Watching for changes...');
await cssContext.watch();

// Watch JS files
jsFiles.forEach(file => {
  fs.watch(file, async () => {
    console.log(`🔄 Rebuilding JS (${file} changed)...`);
    await buildJS();
    console.log('✅ JS rebuilt');
  });
});

console.log('✨ Watch mode active. Press Ctrl+C to stop.');
