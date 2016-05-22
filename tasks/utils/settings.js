var path = require('path');
var Config = require('merge-config');
var utils = require('./utils');

var Settings = (function() {
  function Settings() {
    var environment = utils.argument('env');
    var currentPlatform = utils.argument('platform');
    this.environment = environment != null ? environment : 'development';
    this.currentPlatform = currentPlatform != null ? currentPlatform : false;
    this.config = new Config();
    this.config.file(path.join('config', 'settings.json'));
    this.config.file(path.join('config', 'environments', (this.env()) + ".json"));
    this.config.file(path.join('config', 'platforms', (this.platform()) + ".json"));
  }

  Settings.prototype.env = function() {
    return utils.argument('env') || this.environment;
  };

  Settings.prototype.platform = function() {
    return this.currentPlatform || process.platform;
  };

  Settings.prototype.get = function(key) {
    if (key == null) {
      key = '';
    }
    return this.config.get(key);
  };

  return Settings;

})();

module.exports = Settings;
