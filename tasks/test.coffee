gulp = require('gulp')
childProcess = require('child_process')

gulp.task 'mocha', ->
  childProcess.spawn 'mocha', ['spec'], {stdio: 'inherit'}

gulp.task 'test', ['package:test', 'mocha']
