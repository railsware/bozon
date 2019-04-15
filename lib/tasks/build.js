const fs = require('fs')
const jsonEditor = require('gulp-json-editor')
const bozon = require('../bozon')
const { task, series, watch } = bozon.requireLocal('gulp')

bozon.hooks.push(
  'html',
  'images',
  'styles',
  'scripts:main',
  'scripts:renderer'
)

function html(cb) {
  bozon.src('*.html').pipe(bozon.dest())
  cb()
}

function images(cb) {
  return bozon.src('images/**/*').pipe(bozon.dest('images'))
  cb()
}

function styles(cb) {
  return bozon.src('stylesheets/**/*.css').pipe(bozon.dest('stylesheets'))
  cb()
}

function main(cb) {
  return bozon.src('javascripts/main/**/*.*').pipe(bozon.dest('javascripts/main'))
  cb()
}

function renderer(cb) {
  var webpack = bozon.requireLocal('webpack-stream')
  return bozon.src('javascripts/renderer/application.*').pipe(
    webpack(bozon.webpackConfig())
  ).pipe(bozon.dest('javascripts/renderer'))
  cb()
}

function bundle(cb) {
  var settings = new bozon.Settings()
  fs.stat(bozon.sourcePath('node_modules'), function (err, stat) {
    if (!err) {
      var platform = process.platform
      var command = platform !== 'darwin' && platform.indexOf('win') > -1 ? 'copy' : 'cp'
      bozon.spawnSync(command, [
        '-r',
        bozon.sourcePath('node_modules'),
        bozon.destinationPath()
      ])
    }
  })
  return bozon.src('package.json').pipe(jsonEditor({
    settings: settings.get()
  })).pipe(bozon.dest())
  cb()
}

task('prepare:app', series(html, images, styles, main, renderer, bundle))

module.exports = {
  html,
  images,
  styles,
  main,
  renderer,
  bundle
}
