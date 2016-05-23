var path = require('path');
var gulp = require('gulp');
var childProcess = require('child_process');
var utils = require('./utils');
var Settings = require('./settings');

var bozon = {
  Settings: Settings,

  task: function () {
    return gulp.task.apply(gulp, arguments);
  },

  buildTask: function () {
    bozon.hooks.push(arguments[0]);
    return gulp.task.apply(gulp, arguments);
  },

  src: function (suffix) {
    return gulp.src(this.sourcePath(suffix));
  },

  dest: function (suffix) {
    return gulp.dest(this.destinationPath(suffix));
  },

  sourcePath: function (suffix) {
    if (suffix == null) {
      suffix = '';
    }
    return path.join(process.cwd(), 'app', suffix);
  },

  destinationPath: function (suffix) {
    if (suffix == null) {
      suffix = '';
    }

    var env = utils.argument('env') || 'development';
    var platform = utils.argument('platform') || '';

    if (env === 'test' || env === 'development') {
      return path.join(process.cwd(), 'builds', env, suffix);
    } else {
      return path.join(process.cwd(), 'builds', env, platform, suffix);
    }
  },

  buildPath: function (platform) {
    var env = this.packagingEnv();

    if (env === 'test' || env === 'development') {
      return path.join(process.cwd(), 'builds', env);
    } else {
      return path.join(process.cwd() , 'builds', env, platform);
    }
  },

  releasePath: function () {
    var env = this.packagingEnv();

    console.log(env)

    if (env === 'test') {
      return path.join(process.cwd(), '.tmp');
    } else {
      return path.join(process.cwd(), './packages');
    }
  },

  packagerPath: function () {
    return path.join(process.cwd(), 'node_modules', '.bin', 'electron-packager');
  },

  settings: function () {
    return require(path.join(process.cwd(), 'package.json'));
  },

  spawnSync: function(command, options) {
    childProcess.spawnSync(command, options, {
      shell: true,
      stdio: 'inherit'
    });
  },

  packagingEnv: function () {
    return utils.argument('env') || 'production';
  },

  testPackagingOptions: function() {
    var settings = this.settings();

    return [
      './builds/test',
      settings.name,
      "--platform=" + process.platform,
      "--arch=" + process.arch,
      "--out=.tmp",
      "--icon=" + settings.packaging.platformResources[process.platform].icon,
      "--overwrite"
    ];
  },

  productionPackagingOptions: function(os, arch) {
    var settings = this.settings();

    var args = [
      this.buildPath(os),
      settings.name,
      "--platform=" + os,
      "--arch=" + arch,
      "--out=" + this.releasePath(),
      "--icon=" + settings.packaging.platformResources[os].icon
    ];
    if (settings.packaging.overwrite) {
      args.push('--overwrite');
    }
    if (settings.packaging.archive) {
      args.push('--asar');
    }
    return args;
  },

  hooks: []
}

module.exports = bozon
