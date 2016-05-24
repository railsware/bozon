var path = require('path');

module.exports.argument = function (name) {
  var regexp = new RegExp('--' + name + '=');
  var arg = process.argv.find(function (item) {
    return item.match(regexp);
  });
  if (arg) {
    return arg.split('=')[1];
  } else {
    return null;
  }
};

module.exports.destination = function (suffix) {
  if (suffix == null) {
    suffix = '';
  }

  var env = this.argument('env') || 'development';
  var platform = this.argument('platform') || '';

  if (env === 'test' || env === 'development') {
    return path.join('builds', env, suffix);
  } else {
    return path.join('builds', env, platform, suffix);
  }
};

module.exports.source = function (suffix) {
  if (suffix == null) {
    suffix = '';
  }
  return path.join('app', suffix);
};

module.exports.release = function (env) {
  if (env === 'test') {
    return '.tmp';
  } else {
    return './packages';
  }
};

module.exports.buildSource = function (env, platform) {
  if (env === 'test' || env === 'development') {
    return path.join('builds', env);
  } else {
    return path.join('builds', env, platform);
  }
}

module.exports.settings = function () {
  return require(path.join(process.cwd(), 'package.json'));
};
