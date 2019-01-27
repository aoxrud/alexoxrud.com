/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  fs = require('fs'),
  browserSync = require('browser-sync'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gulpCopy = require('gulp-copy');

/*
 * Directories here
 */
var paths = {
  public: './public/',
  sass: './src/',
  css: './public/css/'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
  return gulp.src('./src/index.pug')
    .pipe(data(function (file) {
      let dataFile = './src/'+path.basename(file.path) + '.json';
      if (fs.existsSync(dataFile)) {
        return JSON.parse(fs.readFileSync(dataFile).toString());
      } else {
        return {};
      }
    }))
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.public))
    .pipe(browserSync.reload({
      stream: true
    }));
});


/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug', 'babel'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    serveStatic: [{
      route: '/node_modules',
      dir: 'node_modules'
    }],
    notify: false
  });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/**
 * Compile .js files into public directory
 */
gulp.task('babel', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass']);
  gulp.watch('./src/**/*.pug', ['pug']);
  gulp.watch('./src/**/*.pug.json', ['pug']);
  gulp.watch('./src/**/*.js', ['babel']);
});

/**
 * Compile .js files into public directory
 */
gulp.task('copy-assets', function () {
  return gulp.src([
      "./node_modules/waypoints/src/waypoint.js",
      "./node_modules/waypoints/src/group.js",
      "./node_modules/waypoints/src/context.js",
      "./node_modules/waypoints/src/adapters/noframework.js",
    ])
    .pipe(concat('vendor.js',  {newLine: ';'}))
    .pipe(uglify())
    .pipe(gulp.dest('./public/'))
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['copy-assets', 'browser-sync', 'watch']);