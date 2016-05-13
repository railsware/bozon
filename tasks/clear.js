var gulp = require('gulp');
var del = require('del');

gulp.task('clear:builds', function(done) {
  del(['./builds/**']).then(function() {
    done()
  });
});

gulp.task('clear:packages', function() {
  del(['./packages/**']).then(function() {
    done()
  });
});

gulp.task('clear', ['clear:builds', 'clear:packages']);
