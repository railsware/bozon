var bozon = require('../lib/bozon');
var path = require('path')
var childProcess = require('child_process');

bozon.task('electron', function() {
  childProcess.spawn(path.join('.', 'node_modules', '.bin', 'electron'), ['./builds/development'], {
    shell: true,
    stdio: 'inherit'
  });
});

bozon.task('start', ['build:development', 'electron']);
