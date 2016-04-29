gulp = require('gulp')
sass = require('gulp-sass')
coffee = require('gulp-coffee')
concat = require('gulp-concat')
webpack = require('gulp-webpack')
childProcess = require('child_process')
jsonEditor = require('gulp-json-editor')
runSequence = require('run-sequence')
argv = require('yargs').argv

utils = require('./utils/utils')
Settings = require('./utils/settings')

settings = {}

source = (suffix = '') ->
  gulp.src utils.source(suffix)

destination = (suffix = '') ->
  gulp.dest utils.destination(argv.env, argv.platform, suffix)

gulp.task 'html', ->
  source('*.html').pipe destination()

gulp.task 'sass', ->
  source('stylesheets/*.sass')
    .pipe(sass.sync(
      outputStyle: 'expanded'
      precision: 10
      includePaths: [ '.' ])
    .on('error', sass.logError))
    .pipe destination('stylesheets')

gulp.task 'coffee', ->
  source('javascripts/browser/application.coffee')
    .pipe webpack
      target: 'electron'
      output:
        filename: 'application.js'
    .pipe destination('javascripts/browser')

  source('javascripts/main/**/*.coffee')
    .pipe(coffee(bare: true).on('error', console.log))
    .pipe destination('javascripts/main')

gulp.task 'extras', ->
  source('package.json')
    .pipe(jsonEditor(settings: settings.get()))
    .pipe destination()

gulp.task 'images',  ->
  source('images/**/*').pipe destination('images')

gulp.task 'compile', ->
  settings = new Settings(argv.env, argv.platform)
  runSequence 'coffee', 'sass', 'html', 'images', 'extras'

gulp.task 'build:development', ->
  childProcess.spawnSync 'gulp', ['compile', '--env=development', "--platform=#{process.platform}"], stdio: 'inherit'

gulp.task 'build:test', ->
  childProcess.spawnSync 'gulp', ['compile', '--env=test', "--platform=#{process.platform}"], stdio: 'inherit'
