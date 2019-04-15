const bozon = require('../bozon')
const { task, parallel, watch } = bozon.requireLocal('gulp')
const { html, images, styles, main, renderer } = require('./build')

task('watch', function html(cb) {
  watch(bozon.sourcePath('**/*.html'), html)
  watch(bozon.sourcePath('images/**/*'), images)
  watch(bozon.sourcePath('stylesheets/**/*'), styles)
  watch(bozon.sourcePath('javascripts/renderer/**/*.*'), renderer)
  watch(bozon.sourcePath('javascripts/main/**/*.*'), main)
  cb()
})
