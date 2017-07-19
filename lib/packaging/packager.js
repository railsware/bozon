var path = require('path')
var bozon = require('../bozon')
var Checker = require('../utils/checker')
var Builder = require('../building/builder')

var Packager = (function () {
  function Packager (platform, environment) {
    Checker.ensure()
    this.name = require(path.join(process.cwd(), 'package.json')).name
    this.version = require('../../package.json').versions['electron']
    this.platform = platform
    this.environment = environment
    this.electronBuilder = bozon.requireLocal('electron-builder')
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
    process.env.CSC_IDENTITY_AUTO_DISCOVERY = false

    return this.electronBuilder.build({
      targets: this.electronBuilder.Platform[platform.toUpperCase()].createTarget(),
      config: {
        mac: {
          target: ['dir']
        },
        linux: {
          target: ['dir']
        },
        win: {
          target: ['dir']
        },
        directories: {
          app: path.join('builds', 'test'),
          buildResources: 'resources',
          output: '.tmp'
        }
      }
    })
  }

  Packager.prototype.productionBuild = function (platform, environment) {
    return this.electronBuilder.build({
      targets: this.electronBuilder.Platform[platform.toUpperCase()].createTarget(),
      config: {
        directories: {
          app: path.join('builds', environment),
          buildResources: 'resources',
          output: 'packages'
        }
      }
    }).catch(function (error) {
      console.log(error)
    })
  }
  return Packager
}
)()

module.exports = Packager
