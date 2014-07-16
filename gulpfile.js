// Load plugins

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    myth = require('gulp-myth'),
    stylus = require('gulp-stylus'),
    csslint = require('gulp-csslint'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload;

// Initialize browser-sync which starts a static server also allows for 
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        }
    });
});

// Function to call for reloading browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./sass/colors-saturated.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass())
          .pipe(prefix())
          .pipe(size({gzip: true, showFiles: true, title:'uncompressed css size'}))
          .pipe(gulp.dest('css'))
          .pipe(browserSync.reload({stream:true}));
      }));
});


// Minify all css files in the css directory
// Run this in the root directory of the project with `gulp minify-css `
gulp.task('minify-css', function(){
  gulp.src('./css/colors-saturated.css')
    .pipe(minifyCSS())
    .pipe(size({gzip: true, showFiles: true, title:'minified css size'}))
    .pipe(rename('colors-saturated.min.css'))
    .pipe(gulp.dest('./css/'));
});

// Use csslint without box-sizing or compatible vendor prefixes (these
// don't seem to be kept up to date on what to yell about)

gulp.task('lint', function(){
  gulp.src('./css/colors-saturated.css')
    .pipe(csslint({
          'compatible-vendor-prefixes': false,
          'box-sizing': false
        }))
    .pipe(csslint.reporter());

});

// Task that compiles scss files down to good old css

gulp.task('sass', function(){
  gulp.src('./sass/*.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass({includePaths: ['./sass/']}))
          .pipe(prefix())
          .pipe(gulp.dest('./css/'));
      }));
});

// Task that compiles css using the myth processor

gulp.task('myth', function(){
  gulp.src('./myth/*.css')
      .pipe(myth())
      .pipe(prefix())
      .pipe(gulp.dest('./css/'));
});


// Just runs autoprefixer on the compiled css

gulp.task('prefix', function(){
  gulp.src('./css/colors-saturated.css')
      .pipe(prefix())
      .pipe(gulp.dest('./css/'));
});

gulp.task('stylus', function(){
  gulp.src('./stylus/colors.styl')
      .pipe(watch(function(files) {
        return files.pipe(stylus())
        .pipe(prefix())
        .pipe(gulp.dest('./css/'))
      }));
});

/*
   DEFAULT TASK

 • Process sass and lints outputted css
 • Outputted css is run through autoprefixer
 • Runs jshint on all js files in ./js/
 • Sends updates to any files in directory to browser for
 automatic reloading

*/

gulp.task('default', ['pre-process', 'minify-css', 'bs-reload', 'browser-sync'], function(){
  gulp.start('pre-process', 'lint');
  gulp.watch('sass/*.scss', ['pre-process', 'minify-css']);
  gulp.watch('css/colors-saturated.css', ['bs-reload']);
  gulp.watch('*.html', ['bs-reload']);
});


