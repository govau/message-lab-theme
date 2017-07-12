'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import yaml     from 'js-yaml';
import fs       from 'fs';
import del      from 'del';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const STAGING = !!(yargs.argv.staging);

// Check for --live flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PORT, PROXY, PATHS, ENVIRONMENTS, CLEAN } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}


// Build the site, run the server, and watch for file changes
gulp.task('default', gulp.series(clean, sass, server, watch));

// Clean out the folders specified by the CLEAN constant.

function clean() {
  return del(
    CLEAN
  );
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('./sass/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass,
      noCache: true
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(!(PRODUCTION || STAGING), $.sourcemaps.write()))
    .pipe(gulp.dest('css'))
    .pipe(browser.reload({ stream: true }));
}

function jsWatch(done) {
  browser.reload();
  done();
}

function twigWatch(done) {
  browser.reload();
  done();
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    proxy: ENVIRONMENTS.development
  });
  done();
}

// Watch for changes to Sass, twig files and .js.
function watch() {
  gulp.watch(['./sass/**/*.scss', './pancake/**/*.scss'], sass);
  gulp.watch(['./templates/**/*.html.twig', '*.theme'], twigWatch);
  gulp.watch('./js/**/*.js', jsWatch);
}
