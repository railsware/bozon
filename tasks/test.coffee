gulp = require('gulp')
mocha = require('gulp-mocha')
childProcess = require('child_process')

gulp.task 'mocha', ->
  gulp.src('./spec/*', read: false).pipe(mocha())

gulp.task 'test', ['package:test', 'mocha']
