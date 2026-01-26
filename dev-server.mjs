import { exec } from 'child_process';
import { create as browserSyncCreate } from 'browser-sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserSync = browserSyncCreate();

const path404 = path.join(__dirname, 'documentation/output/404.html');
const content_404 = () =>
  fs.existsSync(path404) ? fs.readFileSync(path404) : null;

// Start esbuild watch mode in background
const esbuildWatch = spawn('node', ['esbuild-watch.mjs'], {
  stdio: 'inherit',
});

// Build Pelican content
const buildContent = () => {
  return new Promise((resolve, reject) => {
    exec('cd documentation && invoke build', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Pelican build failed:', error);
        reject(error);
        return;
      }
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      console.log('✅ Pelican build completed');
      resolve();
    });
  });
};

// Initial Pelican build
console.log('🔨 Building Pelican site...');
await buildContent();

// Start browser-sync
browserSync.init(
  {
    ui: {
      port: 9002,
    },
    server: {
      baseDir: 'documentation/output',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    files: [
      'documentation/output/**/*.html',
      'static/css/elegant.dev.css',
      'static/js/elegant.dev.js',
    ],
    port: 9001,
  },
  (_, bs) => {
    bs.addMiddleware('*', (_, res) => {
      res.write(content_404());
      res.end();
    });
  }
);

console.log('🌐 Browser-sync started at http://localhost:9001');

// Watch Pelican content and templates
const watchPaths = [
  'documentation/content/**/*.md',
  'documentation/content/**/*.rest',
  'documentation/pelicanconf.py',
  'documentation/publishconf.py',
  'templates/**/*.html',
];

let buildQueued = false;
let isBuilding = false;

const triggerBuild = async () => {
  if (isBuilding) {
    buildQueued = true;
    return;
  }

  isBuilding = true;
  console.log('🔄 Content changed, rebuilding Pelican...');

  try {
    await buildContent();
    browserSync.reload();
  } catch (error) {
    console.error('Build error:', error);
  } finally {
    isBuilding = false;
    if (buildQueued) {
      buildQueued = false;
      triggerBuild();
    }
  }
};

// Simple file watcher for Pelican files
watchPaths.forEach(pattern => {
  const watchDir = pattern.split('/**')[0];
  if (fs.existsSync(watchDir)) {
    fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.md') || filename.endsWith('.rest') || filename.endsWith('.html') || filename.endsWith('.py'))) {
        triggerBuild();
      }
    });
  }
});

console.log('👀 Watching for file changes...');
console.log('✨ Dev server running. Press Ctrl+C to stop.');

// Clean up on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping dev server...');
  esbuildWatch.kill();
  browserSync.exit();
  process.exit(0);
});
