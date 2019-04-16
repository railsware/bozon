const bozon = require('../bozon')
const { watch } = require('gulp')
const { html, images, styles, main, renderer } = require('./build')

function watchSource(cb) {
  watch(bozon.sourcePath('**/*.html'), html)
  watch(bozon.sourcePath('images/**/*'), images)
  watch(bozon.sourcePath('stylesheets/**/*'), styles)
  watch(bozon.sourcePath('javascripts/renderer/**/*.*'), renderer)
  watch(bozon.sourcePath('javascripts/main/**/*.*'), main)
  cb()
}

module.exports = watchSource
