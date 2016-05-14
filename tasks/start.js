var gulp = require('gulp');
var path = require('path')
var childProcess = require('child_process');

gulp.task('electron', function() {
  childProcess.spawn(path.join('.', 'node_modules', '.bin', 'electron'), ['./builds/development'], {
    shell: true,
    stdio: 'inherit'
  });
});

gulp.task('start', ['build:development', 'electron']);
