gulp = require('gulp')
childProcess = require('child_process')

gulp.task 'clear:builds', ->
  childProcess.spawn('rm', ['-rf', './builds'])

gulp.task 'clear:packages', ->
  childProcess.spawn('rm', ['-rf', './packages'])

gulp.task 'clear', ['clear:builds', 'clear:packages']
