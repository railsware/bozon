var path = require('path');
var gulp = require('gulp');
var childProcess = require('child_process');
var argv = require('yargs').argv;
var utils = require('./utils/utils');
var env = argv.env || 'production';

var testOptions = function() {
  var ref, ref1;
  return ['./builds/test', utils.settings().name, "--platform=" + process.platform, "--arch=" + process.arch, "--icon=" + ((ref = utils.settings().packaging.platformResources) != null ? (ref1 = ref[process.platform]) != null ? ref1.icon : void 0 : void 0), "--out=.tmp", "--overwrite"];
};

var productionOptions = function(os, arch) {
  var args;
  args = [utils.destination(env, os), utils.settings().name, "--platform=" + os, "--arch=" + arch, "--out=" + (utils.release(env, os)), "--icon=" + utils.settings().packaging.platformResources[os].icon];
  if (utils.settings().packaging.overwrite) {
    args.push('--overwrite');
  }
  if (utils.settings().packaging.archive) {
    args.push('--asar');
  }
  return args;
};

gulp.task('package', function() {
  var arch, i, len, os, platform, ref;
  ref = utils.settings().packaging.platforms;
  for (i = 0, len = ref.length; i < len; i++) {
    platform = ref[i];
    os = platform.split('-')[0];
    arch = platform.split('-')[1];
    childProcess.spawnSync('gulp', ['compile', "--env=" + env, "--platform=" + os], {
      shell: true,
      stdio: 'inherit'
    });
    childProcess.spawnSync(path.join('.', 'node_modules', '.bin', 'electron-packager'), productionOptions(os, arch), {
      shell: true,
      stdio: 'inherit'
    });
  }
});

gulp.task('package:test', ['build:test'], function() {
  childProcess.spawnSync(path.join('.', 'node_modules', '.bin', 'electron-packager'), testOptions(), {
    shell: true,
    stdio: 'inherit'
  });
});
