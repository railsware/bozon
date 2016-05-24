var path = require('path');
var Config = require('merge-config');
var utils = require('./utils');

var Settings = (function () {
  function Settings () {
    this.config = new Config();
    this.config.file(path.join(configPath(), 'settings.json'));
    this.config.file(path.join(configPath(), 'environments', env() + '.json'));
    this.config.file(path.join(configPath(), 'platforms', platform() + '.json'));
  }

  function configPath () {
    return path.join(process.cwd(), 'config');
  }

  function env () {
    return utils.argument('env') || 'development';
  };

   function platform () {
     return utils.argument('platform') || process.platform;
  };

  Settings.prototype.get = function (key) {
    return this.config.get(key);
  };

  return Settings;

})();

module.exports = Settings;
