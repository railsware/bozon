var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var webpack = require('webpack-stream');
var childProcess = require('child_process');
var jsonEditor = require('gulp-json-editor');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;
var utils = require('./utils/utils');
var Settings = require('./utils/settings');

settings = {};

var source = function(suffix) {
  if (suffix == null) {
    suffix = '';
  }
  return gulp.src(utils.source(suffix));
};

var destination = function(suffix) {
  if (suffix == null) {
    suffix = '';
  }
  return gulp.dest(utils.destination(argv.env, argv.platform, suffix));
};

gulp.task('html', function() {
  source('*.html').pipe(destination());
});

gulp.task('styles', function() {
  source('stylesheets/**/*.css').pipe(destination('stylesheets'));

  source('stylesheets/**/*.sass').pipe(sass.sync({
    outputStyle: 'expanded',
    precision: 10,
    includePaths: ['.']
  }).on('error', sass.logError)).pipe(destination('stylesheets'));
});

gulp.task('scripts', function() {
  source('javascripts/main/**/*.js').pipe(destination('javascripts/main'));

  source('javascripts/browser/application.*').pipe(webpack({
    target: 'electron',
    output: {
      filename: 'application.js'
    }
  })).pipe(destination('javascripts/browser'));

  source('javascripts/main/**/*.coffee').pipe(coffee({
    bare: true
  }).on('error', console.log)).pipe(destination('javascripts/main'));
});

gulp.task('config', function() {
  source('package.json').pipe(jsonEditor({
    settings: settings.get()
  })).pipe(destination());
});

gulp.task('images', function() {
  source('images/**/*').pipe(destination('images'));
});

gulp.task('compile', function() {
  settings = new Settings(argv.env, argv.platform);
  runSequence('scripts', 'styles', 'html', 'images', 'config');
});

gulp.task('build:development', function() {
  childProcess.spawnSync('gulp', ['compile', '--env=development', "--platform=" + process.platform], {
    shell: true,
    stdio: 'inherit'
  });
});

gulp.task('build:test', function() {
  childProcess.spawnSync('gulp', ['compile', '--env=test', "--platform=" + process.platform], {
    shell: true,
    stdio: 'inherit'
  });
});
