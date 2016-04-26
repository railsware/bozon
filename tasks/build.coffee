gulp = require('gulp')
sass = require('gulp-sass')
coffee = require('gulp-coffee')
concat = require('gulp-concat')
wiredep = require('gulp-wiredep')
useref = require('gulp-useref')
shell = require('shelljs')
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
  source('*.html')
    .pipe destination()

gulp.task 'sass', ->
  source('stylesheets/*.sass')
    .pipe(sass.sync(
      outputStyle: 'expanded'
      precision: 10
      includePaths: [ '.' ])
    .on('error', sass.logError))
    .pipe destination('stylesheets')

gulp.task 'coffee', ->
  source('javascripts/browser/**/*.coffee')
    .pipe(coffee(bare: true).on('error', console.log))
    .pipe(concat('application.js'))
    .pipe destination('javascripts')

  source('javascripts/main/**/*.coffee')
    .pipe(coffee(bare: true).on('error', console.log))
    .pipe(concat('index.js'))
    .pipe destination()

gulp.task 'extras', ->
  source('package.json')
    .pipe(jsonEditor(settings: settings.get()))
    .pipe destination()

gulp.task 'images',  ->
  source('images/**/*').pipe destination('images')

gulp.task 'compile', ->
  settings = new Settings(argv.env, argv.platform)
  runSequence 'coffee', 'sass', 'html', 'images', 'extras'

gulp.task 'build:development', (cb) ->
  settings = new Settings('development')
  shell.exec "gulp compile --env=development --platform=#{settings.platform()}"

gulp.task 'build:test', (cb) ->
  settings = new Settings('test')
  shell.exec "gulp compile --env=test --platform=#{settings.platform()}"

gulp.task 'build:production', (cb) ->
  settings = new Settings('production')
  for platform in utils.settings().packaging.platforms
    shell.exec "gulp compile --env=production --platform=#{platform.split('-')[0]}"
