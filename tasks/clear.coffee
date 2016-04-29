gulp = require('gulp')
childProcess = require('child_process')

gulp.task 'clear:builds', ->
  childProcess.spawn('rm', ['-rf', './builds'])

gulp.task 'clear:releases', ->
  childProcess.spawn('rm', ['-rf', './releases'])

gulp.task 'clear', ['clear:builds', 'clear:releases']
