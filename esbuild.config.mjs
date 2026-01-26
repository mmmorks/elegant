import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
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

// Build CSS using postcss directly
async function buildCSS() {
  // Read the main CSS file
  const css = fs.readFileSync('static/css/main.css', 'utf8');

  // Process with PostCSS
  const result = await postcss(postcssPlugins).process(css, {
    from: 'static/css/main.css',
    to: isDev ? 'static/css/elegant.dev.css' : 'static/css/elegant.prod.css',
  });

  return result.css;
}

// Vendor JS files from node_modules (in order)
const vendorJsFiles = [
  'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
  'node_modules/applause-button/dist/applause-button.js',
  'node_modules/photoswipe/dist/photoswipe.js',
  'node_modules/photoswipe/dist/photoswipe-ui-default.js',
  'static/photoswipe/photoswipe-array-from-dom.js', // Custom helper
  'node_modules/lunr/lunr.js',
  'node_modules/clipboard/dist/clipboard.js',
];

// Custom JS files (in order)
const customJsFiles = [
  'static/js/create-instagram-gallery.js',
  'static/js/copy-to-clipboard.js',
  'static/js/lunr-search-result.js',
];

// Build JavaScript by concatenating and minifying
async function buildJS() {
  // Concatenate all JS files
  const concatenated = [...vendorJsFiles, ...customJsFiles]
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

// Copy static assets from node_modules
function copyVendorAssets() {
  const copies = [
    // Bootstrap Icons fonts
    {
      from: 'node_modules/bootstrap-icons/font/fonts',
      to: 'static/css/fonts',
      pattern: /\.(woff2?|ttf|eot)$/,
    },
    // PhotoSwipe default skin images/CSS
    {
      from: 'node_modules/photoswipe/dist/default-skin',
      to: 'static/photoswipe/default-skin',
      pattern: /\.(png|svg|gif|css)$/,
    },
  ];

  copies.forEach(({ from, to, pattern }) => {
    // Create destination directory
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true });
    }

    // Copy matching files
    if (fs.existsSync(from)) {
      const files = fs.readdirSync(from);
      files.forEach(file => {
        if (pattern.test(file)) {
          const srcPath = path.join(from, file);
          const destPath = path.join(to, file);

          // Only copy if file or directory
          const stat = fs.statSync(srcPath);
          if (stat.isFile()) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      });
    }
  });
}

// Build assets
async function build() {
  try {
    // Copy vendor assets
    copyVendorAssets();

    // Build CSS
    const cssContent = await buildCSS();
    const cssFinal = isDev ? 'static/css/elegant.dev.css' : 'static/css/elegant.prod.css';
    fs.writeFileSync(cssFinal, cssContent);

    // Build JS
    const jsContent = await buildJS();
    const jsFinal = isDev ? 'static/js/elegant.dev.js' : 'static/js/elegant.prod.js';
    fs.writeFileSync(jsFinal, jsContent);

    const cssSize = (fs.statSync(cssFinal).size / 1024).toFixed(1);
    console.log('✅ Build completed successfully');
    console.log(`   CSS: ${cssFinal} (${cssSize}kb)`);
    console.log(`   JS: ${jsFinal}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

export { build };

// CLI build execution
if (import.meta.url === `file://${process.argv[1]}`) {
  await build();
}
