import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { src, dest, watch, parallel, series } from "gulp";
import { exec } from "child_process";
import { create as browserSyncCreate } from "browser-sync";
import runCommand from "gulp-run-command";
import postcss from "gulp-postcss";
import magician from "postcss-font-magician";
import cssnano from "cssnano";
import postcssPresetEnv from "postcss-preset-env";
import rfs from "rfs";
import concat from "gulp-concat";
import terser from "gulp-terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const run = runCommand.default;

const browserSync = browserSyncCreate();

const path404 = path.join(__dirname, "documentation/output/404.html");
const content_404 = () =>
  fs.existsSync(path404) ? fs.readFileSync(path404) : null;

const cleanOutput = () => exec("cd documentation && rm -rf outout/");

const buildContent = () => exec("cd documentation && invoke build");

const reload = (cb) => {
  browserSync.init(
    {
      ui: {
        port: 9002,
      },
      server: {
        baseDir: "documentation/output",
        serveStaticOptions: {
          extensions: ["html"],
        },
      },
      files: "documentation/output/*.html",
      port: 9001,
    },
    (_, bs) => {
      bs.addMiddleware("*", (_, res) => {
        res.write(content_404());
        res.end();
      });
    }
  );
  cb();
};

const watchFiles = () => {
  watch(
    [
      "documentation/content/**/*.md",
      "documentation/content/**/*.rest",
      "documentation/pelicanconf.py",
      "documentation/publishconf.py",
      "templates/**/*.html",
      "static/**/*.css",
      "static/**/*.js",
      "!static/**/bootstrap.css",
      "!static/**/bootstrap_responsive.css",
      "!static/**/elegant.prod.9e9d5ce754.css",
      "!static/js/elegant.prod.9e9d5ce754.js",
    ],
    { ignoreInitial: false },
    buildAll
  );
};

const pathProdCSS = path.join(
  __dirname,
  "static/css/elegant.prod.9e9d5ce754.css"
);
const rmProdCSS = (cb) => {
  if (fs.existsSync(pathProdCSS)) {
    fs.unlinkSync(pathProdCSS);
  }
  cb();
};
const minifyJS = () => {
  return src([
    "static/applause-button/applause-button.js",
    "static/photoswipe/photoswipe.js",
    "static/photoswipe/photoswipe-ui-default.js",
    "static/photoswipe/photoswipe-array-from-dom.js",
    "static/lunr/lunr.js",
    "static/clipboard/clipboard.js",
    "static/js/create-instagram-gallery.js",
    "static/js/copy-to-clipboard.js",
    "static/js/lunr-search-result.js",
    "!static/js/elegant.prod.9e9d5ce754.js",
  ])
    .pipe(concat("elegant.prod.9e9d5ce754.js"))
    .pipe(terser())
    .pipe(dest("static/js/"));
};

const compileCSS = () => {
  const plugins = [
    // postcssPresetEnv comes with autoprefixer
    postcssPresetEnv({ stage: 1 }),
    magician({}),
    rfs(),
    cssnano({
      preset: "default",
    }),
  ];
  return src([
    "node_modules/bootstrap/dist/css/bootstrap.css",
    "static/applause-button/applause-button.css",
    "static/photoswipe/photoswipe.css",
    "static/photoswipe/default-skin/default-skin.css",
    "static/css/*.css",
    "!static/css/elegant.prod.9e9d5ce754.css",
    "!static/css/bootstrap.css",
    "!static/css/bootstrap_responsive.css",
  ])
    .pipe(postcss(plugins))
    .pipe(concat("elegant.prod.9e9d5ce754.css"))
    .pipe(dest("static/css/"));
};

const buildAll = series(
  rmProdCSS,
  compileCSS,
  minifyJS,
  buildContent
);

export const validate = run("jinja-ninja templates");

export const js = minifyJS;

export const css = series(
  rmProdCSS,
  compileCSS
);

export const build = series(
  compileCSS,
  minifyJS,
  cleanOutput,
  buildContent
);

const elegant = series(build, parallel(watchFiles, reload));
export { elegant };
export default elegant;
