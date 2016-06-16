var webpack = require('webpack-stream')
var jsonEditor = require('gulp-json-editor')
var runSequence = require('run-sequence')
var bozon = require('../lib/bozon')

bozon.hooks.push(
  'scripts:main',
  'scripts:renderer',
  'styles',
  'html',
  'images',
  'config',
  'node_modules'
)

bozon.task('html', function () {
  return bozon.src('*.html').pipe(bozon.dest())
})

bozon.task('styles', function () {
  return bozon.src('stylesheets/**/*.css').pipe(bozon.dest('stylesheets'))
})

bozon.task('scripts:main', function () {
  return bozon.src('javascripts/main/**/*.*').pipe(bozon.dest('javascripts/main'))
})

bozon.task('scripts:renderer', function () {
  return bozon.src('javascripts/renderer/application.*').pipe(webpack({
    target: 'electron',
    output: {
      filename: 'application.js'
    }
  })).pipe(bozon.dest('javascripts/renderer'))
})

bozon.task('config', function () {
  var settings = new bozon.Settings()
  return bozon.src('package.json').pipe(jsonEditor({
    settings: settings.get()
  })).pipe(bozon.dest())
})

bozon.task('images', function () {
  return bozon.src('images/**/*').pipe(bozon.dest('images'))
})

bozon.task('node_modules', function () {
  return bozon.spawnSync('cp', [
    '-r',
    bozon.sourcePath('node_modules'),
    bozon.destinationPath()
  ])
})

bozon.task('compile', function (callback) {
  runSequence.apply(this, bozon.hooks.concat(callback))
})
