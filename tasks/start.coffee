gulp = require('gulp')
childProcess = require('child_process')

gulp.task 'electron', ->
  childProcess.spawn './node_modules/.bin/electron', ['./builds/development'], stdio: 'inherit'

gulp.task 'start', ['build:development', 'electron']
