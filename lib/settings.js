var path = require('path')
var Config = require('merge-config')
var utils = require('./utils')

var Settings = (function () {
  function Settings () {
    this.config = new Config()
    this.config.file(path.join(configPath(), 'settings.json'))
    this.config.file(path.join(configPath(), 'environments', this.env() + '.json'))
    this.config.file(path.join(configPath(), 'platforms', this.platform() + '.json'))
  }

  function configPath () {
    return path.join(process.cwd(), 'config')
  }

  Settings.prototype.platform = function () {
    var os = utils.argument('platform') || process.platform
    if (os === 'osx' || os === 'darwin') {
      return 'osx'
    } else if (os === 'windows' || os === 'win32') {
      return 'windows'
    } else if (os === 'linux') {
      return 'linux'
    } else {
      throw new Error('Unsupported platfom ' + os)
    }
  }

  Settings.prototype.env = function () {
    return utils.argument('env') || 'development'
  }

  Settings.prototype.get = function (key) {
    return this.config.get(key)
  }

  return Settings
}
)()

module.exports = Settings
