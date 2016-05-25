var webpack = require('webpack-stream');
var jsonEditor = require('gulp-json-editor');
var runSequence = require('run-sequence');
var bozon = require('../lib/bozon');

var settings = {};

bozon.task('html', function () {
  bozon.src('*.html').pipe(bozon.dest());
});

bozon.task('styles', function () {
  bozon.src('stylesheets/**/*.css').pipe(bozon.dest('stylesheets'));
});

bozon.task('scripts:main', function () {
  bozon.src('javascripts/main/**/*.js').pipe(bozon.dest('javascripts/main'));
});

bozon.task('scripts:renderer', function () {
  bozon.src('javascripts/renderer/application.*').pipe(webpack({
    target: 'electron',
    output: {
      filename: 'application.js'
    }
  })).pipe(bozon.dest('javascripts/renderer'));
});

bozon.task('config', function () {
  bozon.src('package.json').pipe(jsonEditor({
    settings: settings.get()
  })).pipe(bozon.dest());
});

bozon.task('images', function () {
  bozon.src('images/**/*').pipe(bozon.dest('images'));
});

bozon.task('compile', function () {
  settings = new bozon.Settings();
  runSequence('scripts:main', 'scripts:renderer', 'styles', 'html', 'images', 'config');
});

bozon.task('build:development', function () {
  bozon.spawnSync('gulp', ['compile', '--env=development', '--platform=' + process.platform])
});

bozon.task('build:test', function () {
  bozon.spawnSync('gulp', ['compile', '--env=test', '--platform=' + process.platform])
});
