var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat');

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  //watch files
  var files = [
    './style.css'
  ];

  //initialize browsersync
  browserSync.init(files, {
    //browsersync with a php server
    proxy: "localhost/cartografias/",
    notify: true
  });
});

// Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function() {
  return gulp.src('assets/styles/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(rename({
      extname: '.css'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('jsMain', function() {
  gulp.src('assets/js/source/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('jsPlugins', function() {
  gulp.src(['assets/js/source/plugins.js','assets/js/source/plugins/*.js'])
    .pipe(concat('plugins.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js'))
    .pipe(reload({
      stream: true
    }));
});

// Default task to be run with `gulp`
gulp.task('default', ['sass', 'jsMain', 'jsPlugins', 'browser-sync'], function() {
  gulp.watch("assets/styles/*.scss", ['sass']);
  gulp.watch("assets/js/source/main.js", ['jsMain']);
  gulp.watch("assets/js/source/plugins/*.js", ['jsPlugins']);
});