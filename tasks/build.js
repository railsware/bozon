var gulp = require('gulp');
var webpack = require('webpack-stream');
var childProcess = require('child_process');
var jsonEditor = require('gulp-json-editor');
var runSequence = require('run-sequence');
var utils = require('./utils/utils');
var Settings = require('./utils/settings');

settings = {};

var source = function(suffix) {
  return gulp.src(utils.source(suffix));
};

var destination = function(suffix) {
  var env = utils.argument('env');
  var platform = utils.argument('platform');
  return gulp.dest(utils.destination(suffix));
};

gulp.task('html', function() {
  source('*.html').pipe(destination());
});

gulp.task('styles', function() {
  source('stylesheets/**/*.css').pipe(destination('stylesheets'));
});

gulp.task('scripts', function() {
  source('javascripts/main/**/*.js').pipe(destination('javascripts/main'));

  source('javascripts/renderer/application.*').pipe(webpack({
    target: 'electron',
    output: {
      filename: 'application.js'
    }
  })).pipe(destination('javascripts/renderer'));
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
  settings = new Settings();
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
