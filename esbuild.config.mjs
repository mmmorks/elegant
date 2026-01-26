import * as esbuild from 'esbuild';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const postcssPlugin = require('esbuild-plugin-postcss2').default;
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import magician from 'postcss-font-magician';
import rfs from 'rfs';
import cssnano from 'cssnano';

const isDev = process.env.NODE_ENV !== 'production';

// PostCSS plugins configuration
const postcssPlugins = [
  postcssImport(),
  postcssPresetEnv({ stage: 1 }),
  magician({}),
  rfs(),
  !isDev && cssnano({ preset: 'default' }),
].filter(Boolean);

// Common esbuild options
const commonOptions = {
  bundle: true,
  sourcemap: isDev,
  minify: !isDev,
  logLevel: 'info',
};

// CSS build configuration
const cssOptions = {
  ...commonOptions,
  entryPoints: ['static/css/main.css'],
  outfile: isDev ? 'static/css/elegant.dev.css' : 'static/css/elegant.prod.css',
  plugins: [
    postcssPlugin({
      plugins: postcssPlugins,
      rootDir: process.cwd(),
    }),
  ],
};

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

// Build JavaScript by concatenating and minifying
async function buildJS() {
  // Concatenate all JS files
  const concatenated = jsFiles
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');

  // Minify with esbuild
  const result = await esbuild.transform(concatenated, {
    minify: !isDev,
    sourcemap: isDev,
    target: ['es2020'],
  });

  return result.code;
}

// Build assets
async function build() {
  try {
    // Build CSS
    await esbuild.build(cssOptions);

    // Build JS
    const jsContent = await buildJS();
    const jsFinal = isDev ? 'static/js/elegant.dev.js' : 'static/js/elegant.prod.js';
    fs.writeFileSync(jsFinal, jsContent);

    const cssFinal = isDev ? 'static/css/elegant.dev.css' : 'static/css/elegant.prod.css';
    console.log('✅ Build completed successfully');
    console.log(`   CSS: ${cssFinal}`);
    console.log(`   JS: ${jsFinal}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

export { cssOptions, build };

// CLI build execution
if (import.meta.url === `file://${process.argv[1]}`) {
  await build();
}
