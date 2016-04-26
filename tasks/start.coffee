gulp = require('gulp')
shell = require('shelljs')

gulp.task 'electron', (cb) ->
  shell.exec './node_modules/.bin/electron ./builds/development'
  cb()

gulp.task 'start', ['build:development', 'electron']
