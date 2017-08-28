'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import yaml     from 'js-yaml';
import fs       from 'fs';
import del      from 'del';
import imagemin from 'gulp-imagemin';
import cache    from 'gulp-cache';
import npmcheck    from 'gulp-npm-check';

// Load all Gulp plugins into one variable
const $ = plugins();

// Set up environment constants.
const PRODUCTION = !!(yargs.argv.production);
const STAGING = !!(yargs.argv.staging);

// Load settings from settings.yml
const { NAME, PORT, CLEAN, ENVIRONMENTS, COMPATIBILITY, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the site, run the server, and watch for file changes
gulp.task('default', gulp.series(deps, clean, optimiseImages, js, sass, server, watch));

// Clean out the folders specified by the CLEAN constant.

function clean() {
  return del(
    CLEAN
  );
}

function optimiseImages(done) {
  gulp.src('.' + PATHS.images + '/**/*.*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('./img'));
  browser.reload();
  done();
}

// Check dependencies.

function deps(cb) {
  npmcheck(cb);
}

// Move scripts from source into destination.
// If anything else needs to happen to the JS, do it here.

function js() {
  return gulp.src('.' + PATHS.jsRoot + '/**/*.js')
    .pipe(gulp.dest('./js'));
}

// Compile Sass into CSS
function sass() {
  return gulp.src('.' + PATHS.sassRoot + '/**/*.scss')
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
    .pipe(gulp.dest('./css'))
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
  var matchCSS = PATHS.themesRoot + NAME + PATHS.cssRoot + NAME + '.style.css';
  var matchJS = PATHS.themesRoot + NAME + PATHS.jsRoot + NAME + '.script.js';
  var localCSS = PATHS.cssRoot + NAME + '.style.css';
  var localJS = PATHS.jsRoot + NAME + '.script.js';
  if(PRODUCTION) {
    browser.init({
      proxy: ENVIRONMENTS.production,
      serveStatic: ['.'],
      rewriteRules: [
        {
          match: new RegExp(matchCSS),
          fn: function() {
            return localCSS;
          }
        },
        {
          match: new RegExp(matchJS),
          fn: function() {
            return localJS;
          }
        },
    ]
    });
  } else if(STAGING) {
    browser.init({
      proxy: ENVIRONMENTS.staging,
      serveStatic: ['.'],
      rewriteRules: [
        {
          match: new RegExp(matchCSS),
          fn: function() {
            return localCSS;
          }
        },
        {
          match: new RegExp(matchJS),
          fn: function() {
            return localJS;
          }
        },
    ]
    });
  } else {
    browser.init({
      proxy: ENVIRONMENTS.development
    });
  }
  done();
}

// Watch for changes to Sass, twig files and .js.
function watch() {
  gulp.watch(['./src/sass/**/*.scss', './pancake/**/*.scss'], sass);
  gulp.watch(['./templates/**/*.html.twig', '*.theme'], twigWatch);
  gulp.watch('./src/scripts/**/*.js', gulp.series(js, jsWatch));
  gulp.watch('./src/images/**/*.*', optimiseImages);
}
