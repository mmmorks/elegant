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
  outfile: 'static/css/elegant.tmp.css',
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

// Helper to generate content hash
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 10);
}

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

// Build with content hashing
async function build() {
  try {
    // Build CSS
    await esbuild.build(cssOptions);
    const cssContent = fs.readFileSync('static/css/elegant.tmp.css', 'utf8');

    // Build JS
    const jsContent = await buildJS();

    // Generate hashes
    const cssHash = generateHash(cssContent);
    const jsHash = generateHash(jsContent);

    // Write final files with hashes
    const cssFinal = isDev
      ? 'static/css/elegant.dev.css'
      : `static/css/elegant.prod.${cssHash}.css`;
    const jsFinal = isDev
      ? 'static/js/elegant.dev.js'
      : `static/js/elegant.prod.${jsHash}.js`;

    fs.writeFileSync(cssFinal, cssContent);
    fs.writeFileSync(jsFinal, jsContent);

    // Clean up temp file
    fs.unlinkSync('static/css/elegant.tmp.css');

    // Write manifest for template integration
    const manifest = {
      'elegant.css': cssFinal.replace('static/', ''),
      'elegant.js': jsFinal.replace('static/', ''),
    };
    fs.writeFileSync('static/manifest.json', JSON.stringify(manifest, null, 2));

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
