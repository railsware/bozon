var path = require('path');
var Config = require('merge-config');
var utils = require('./utils');

var Settings = (function() {
  function Settings() {
    this.config = new Config();
    this.config.file(path.join('config', 'settings.json'));
    this.config.file(path.join('config', 'environments', this.env() + ".json"));
    this.config.file(path.join('config', 'platforms', this.platform() + ".json"));
  }

  Settings.prototype.env = function() {
    return utils.argument('env') || 'development';
  };

  Settings.prototype.platform = function() {
    return utils.argument('platform') || process.platform;
  };

  Settings.prototype.get = function(key) {
    return this.config.get(key);
  };

  return Settings;

})();

module.exports = Settings;
