var jsonEditor = require('gulp-json-editor')
var bozon = require('../bozon')

bozon.hooks.push(
  'html',
  'images',
  'styles',
  'scripts:main',
  'scripts:renderer'
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
  var webpack = bozon.requireLocal('webpack-stream')
  return bozon.src('javascripts/renderer/application.*').pipe(webpack({
    target: 'electron',
    output: {
      filename: 'application.js'
    }
  })).pipe(bozon.dest('javascripts/renderer'))
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

bozon.task('prepare:app', bozon.hooks, function () {
  var settings = new bozon.Settings()
  bozon.spawnSync('cp', [
    '-r',
    bozon.sourcePath('node_modules'),
    bozon.destinationPath()
  ])
  return bozon.src('package.json').pipe(jsonEditor({
    settings: settings.get()
  })).pipe(bozon.dest())
})
