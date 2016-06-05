var path = require('path')
var builder = require('electron-builder')

var Packager = (function () {
  function Packager () {
  }

  function output (environment) {
    if (environment === 'test') {
      return '.tmp'
    } else {
      return 'packages'
    }
  }

  Packager.prototype.build = function (platform, environment) {
    return builder.build({
      targets: builder.Platform[platform.toUpperCase()].createTarget(),
      devMetadata: {
        directories: {
          app: path.join('builds', environment),
          buildResources: 'resources',
          output: output(environment)
        }
      }
    })
  }
  return Packager
}
)()

module.exports = Packager
