var path = require('path');

module.exports.argument = function(name) {
  arg = process.argv.find(function (arg) {
    regexp = new RegExp('--' + name + '=');
    return arg.match(regexp);
  });
  if (arg) {
    return arg.split('=')[1];
  } else {
    return null;
  }
};

module.exports.destination = function(suffix) {
  var env = this.argument('env');
  var platform = this.argument('platform');

  if (env === 'test' || env === 'development') {
    return path.join('builds', env, suffix);
  } else {
    return path.join('builds', env, platform, suffix);
  }
};

module.exports.source = function(suffix) {
  return path.join('app', suffix);
};

module.exports.release = function(env, platform) {
  var env = this.argument('env');

  if (env === 'test') {
    return '.tmp';
  } else {
    return './packages';
  }
};

module.exports.buildSourse = function(env, platform) {
  if (env === 'test' || env === 'development') {
    return path.join('builds', env);
  } else {
    return path.join('builds', env, platform);
  }
}

module.exports.settings = function() {
  return require(path.join(process.cwd(), 'package.json'));
};
