var bozon = require('../lib/bozon');
var del = require('del');

bozon.task('clear:builds', function() {
  return del(['./builds/**']);
});

bozon.task('clear:packages', function() {
  return del(['./packages/**']);
});

bozon.task('clear', ['clear:builds', 'clear:packages']);
