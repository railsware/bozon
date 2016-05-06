var gulp = require('gulp');
var childProcess = require('child_process');

gulp.task('clear:builds', function() {
  childProcess.spawn('rm', ['-rf', './builds']);
});

gulp.task('clear:packages', function() {
  childProcess.spawn('rm', ['-rf', './packages']);
});

gulp.task('clear', ['clear:builds', 'clear:packages']);
