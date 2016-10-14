var path = require('path')
var bozon = require('../bozon')
var Builder = require('../building/builder')

var Packager = (function () {
  function Packager (platform, environment) {
    this.name = require(path.join(process.cwd(), 'package.json')).name
    this.version = require('../../package.json').versions['electron']
    this.platform = platform
    this.environment = environment
    this.electronBuilder = bozon.requireLocal('electron-builder')
    this.electronPackager = bozon.requireLocal('electron-packager-tf')
  }
  Packager.prototype.build = function () {
    new Builder(this.platform, this.environment).run()
    if (this.environment === 'test') {
      return this.testBuild(this.platform)
    } else {
      return this.productionBuild(this.platform, this.environment)
    }
  }
  Packager.prototype.testBuild = function (platform) {
    var _this = this
    var options = {
      name: this.name,
      version: this.version,
      platform: process.platform,
      arch: process.arch,
      dir: path.join('builds', 'test'),
      out: path.join('.tmp')
    }
    var promise = new Promise(function (resolve, reject) {
      _this.electronPackager(options, function (err, appPaths) {
        if (err) {
          console.log(err)
          reject()
        } else {
          resolve()
        }
      })
    })
    return promise
  }

  Packager.prototype.productionBuild = function (platform, environment) {
    return this.electronBuilder.build({
      targets: this.electronBuilder.Platform[platform.toUpperCase()].createTarget(),
      devMetadata: {
        directories: {
          app: path.join('builds', environment),
          buildResources: 'resources',
          output: 'packages'
        }
      }
    })
  }
  return Packager
}
)()

module.exports = Packager
