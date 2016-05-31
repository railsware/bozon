var gulp = require('gulp');
var bozon = require('../lib/bozon');
var mocha = require('gulp-mocha');
var childProcess = require('child_process');

bozon.task('mocha', function() {
  return gulp.src('./spec/*', {
    read: false
  }).pipe(mocha());
});

bozon.task('test', ['package:test', 'mocha']);
