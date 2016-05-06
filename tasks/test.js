var gulp = require('gulp');
var mocha = require('gulp-mocha');
var childProcess = require('child_process');

gulp.task('mocha', function() {
  gulp.src('./spec/*', {
    read: false
  }).pipe(mocha());
});

gulp.task('test', ['package:test', 'mocha']);
