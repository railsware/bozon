var path = require('path')
var builder = require('electron-builder')
var packager = require('electron-packager-tf')

var Packager = (function () {
  function Packager () {
    this.name = require(path.join(process.cwd(), 'package.json')).name
    this.version = require('../../package.json').dependencies['electron-prebuilt']
  }
  Packager.prototype.build = function (platform, environment) {
    if (environment === 'test') {
      return this.testBuild(platform, environment)
    } else {
      return this.productionBuild(platform, environment)
    }
  }
  Packager.prototype.testBuild = function (platform) {
    var options = {
      name: this.name,
      version: this.version,
      platform: process.platform,
      arch: process.arch,
      dir: path.join('builds', 'test'),
      out: path.join('.tmp')
    }
    var promise = new Promise(function (resolve, reject) {
      packager(options, function (err, appPaths) {
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
    return builder.build({
      targets: builder.Platform[platform.toUpperCase()].createTarget(),
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
