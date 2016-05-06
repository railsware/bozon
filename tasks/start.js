var gulp = require('gulp');
var childProcess = require('child_process');

gulp.task('electron', function() {
  childProcess.spawn('./node_modules/.bin/electron', ['./builds/development'], {
    stdio: 'inherit'
  });
});

gulp.task('start', ['build:development', 'electron']);
