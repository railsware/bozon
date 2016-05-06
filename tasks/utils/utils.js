var path = require('path');

module.exports.destination = function(env, platform, suffix) {
  if (suffix == null) {
    suffix = '';
  }
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
  if (env === 'test') {
    return '.tmp';
  } else {
    return './packages';
  }
};

module.exports.settings = function() {
  return require(path.join(process.cwd(), 'package.json'));
};
