gulp = require('gulp')
shell = require('shelljs')

gulp.task 'clear:builds', ->
  shell.exec('rm -rf ./builds')

gulp.task 'clear:releases', ->
  shell.exec('rm -rf ./releases')

gulp.task 'clear', ['clear:builds', 'clear:releases']
