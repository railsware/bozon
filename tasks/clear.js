var bozon = require('../lib/bozon');
var del = require('del');

bozon.task('clear:builds', function(done) {
  del(['./builds/**']).then(function() {
    done()
  });
});

bozon.task('clear:packages', function(done) {
  del(['./packages/**']).then(function() {
    done()
  });
});

bozon.task('clear', ['clear:builds', 'clear:packages']);
