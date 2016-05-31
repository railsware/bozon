var webpack = require('webpack-stream');
var jsonEditor = require('gulp-json-editor');
var runSequence = require('run-sequence');
var bozon = require('../lib/bozon');

var settings = {};
bozon.hooks.push(
  'scripts:main',
  'scripts:renderer',
  'styles',
  'html',
  'images',
  'config'
);

bozon.task('html', function () {
  return bozon.src('*.html').pipe(bozon.dest());
});

bozon.task('styles', function () {
  return bozon.src('stylesheets/**/*.css').pipe(bozon.dest('stylesheets'));
});

bozon.task('scripts:main', function () {
  return bozon.src('javascripts/main/**/*.*').pipe(bozon.dest('javascripts/main'));
});

bozon.task('scripts:renderer', function () {
  return bozon.src('javascripts/renderer/application.*').pipe(webpack({
    target: 'electron',
    output: {
      filename: 'application.js'
    }
  })).pipe(bozon.dest('javascripts/renderer'));
});

bozon.task('config', function () {
  return bozon.src('package.json').pipe(jsonEditor({
    settings: settings.get()
  })).pipe(bozon.dest());
});

bozon.task('images', function () {
  return bozon.src('images/**/*').pipe(bozon.dest('images'));
});

bozon.task('compile', function (callback) {
  settings = new bozon.Settings();
  runSequence.apply(this, bozon.hooks.concat(callback));
});

bozon.task('build:development', function () {
  bozon.runGulp(['compile', '--env=development', '--platform=' + process.platform])
});

bozon.task('build:test', function () {
  bozon.runGulp(['compile', '--env=test', '--platform=' + process.platform])
});
