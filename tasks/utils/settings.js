var os = require('os');
var path = require('path');
var Config = require('merge-config');
var argv = require('yargs').argv;

var Settings = (function() {
  function Settings(environment, curerntPlatform) {
    this.environment = environment != null ? environment : 'development';
    this.curerntPlatform = curerntPlatform != null ? curerntPlatform : false;
    this.config = new Config();
    this.config.file(path.join('config', 'settings.json'));
    this.config.file(path.join('config', 'environments', (this.env()) + ".json"));
    this.config.file(path.join('config', 'platforms', (this.platform()) + ".json"));
  }

  Settings.prototype.env = function() {
    return argv.env || this.environment;
  };

  Settings.prototype.platform = function() {
    return this.curerntPlatform || os.platform();
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
