var bozon = require('../lib/bozon');
var childProcess = require('child_process');

bozon.task('mocha', function() {
  childProcess.spawn('mocha', ['--recursive', 'spec/'], {
    shell: true,
    stdio: 'inherit'
  })
});

bozon.task('test', ['package:test', 'mocha']);
