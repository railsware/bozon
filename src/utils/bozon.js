const path = require('path');
const childProcess = require('child_process');
const Config = require('merge-config');

const bozon = {
  srcDir: 'src',

  source: function() {
    const prefix = process.cwd();
    const suffix = path.join.apply(null, arguments);
    return path.join(prefix, suffix);
  },

  config: function(env, platform) {
    const config = new Config();
    config.file(this.source('config', 'settings.json'));
    config.file(this.source('config', 'environments', env + '.json'));
    config.file(this.source('config', 'platforms', platform + '.json'));
    return config.get();
  },

  platform: function() {
    const os = process.platform;
    if (os === 'mac' || os === 'darwin') {
      return 'mac';
    } else if (os === 'windows' || os === 'win32') {
      return 'windows';
    } else if (os === 'linux') {
      return 'linux';
    } else {
      throw new Error('Unsupported platform ' + os);
    }
  },

  binary: function(name) {
    return path.join(process.cwd(), 'node_modules', '.bin', name);
  },

  runMocha: function(params) {
    return this.spawnSync(this.binary('mocha'), params, 'test');
  },

  runElectron: function(options) {
    if (typeof options === 'undefined') {
      options = [];
    }
    options = options.concat([
      path.join(process.cwd(), 'builds', 'development')
    ]);
    return this.spawn(this.binary('electron'), options, 'development');
  },

  spawnSync: function(command, options, environment) {
    const env = Object.create(process.env);
    if (env) env.NODE_ENV = environment;
    return childProcess.spawnSync(command, options, {
      shell: true,
      env: env,
      stdio: 'inherit'
    });
  },

  spawn: function(command, options, environment) {
    const env = Object.create(process.env);
    if (env) env.NODE_ENV = environment;
    return childProcess.spawn(command, options, {
      shell: true,
      env: env,
      stdio: 'inherit'
    });
  },

  sourcePath: function(suffix) {
    if (suffix == null) {
      suffix = '';
    }
    return path.join(process.cwd(), this.srcDir, suffix);
  },

  destinationPath: function(suffix, env) {
    if (suffix == null) {
      suffix = '';
    }
    return path.join(process.cwd(), 'builds', env, suffix);
  },

  log: function(message) {
    console.log(message);
  }
};

module.exports = bozon;
