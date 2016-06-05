var path = require('path')
var builder = require('electron-builder')

var Packager = (function () {
  function Packager (platform, environment) {
    this.env = environment
    this.platform = platform
  }

  function output (environment) {
    if (environment === 'test') {
      return '.tmp'
    } else {
      return 'packages'
    }
  }

  Packager.prototype.build = function (env) {
    return builder.build({
      targets: builder.Platform[this.platform.toUpperCase()].createTarget(),
      devMetadata: {
        directories: {
          app: path.join('builds', this.env),
          buildResources: 'resources',
          output: output(this.env)
        }
      }
    })
  }
  return Packager
}
)()

module.exports = Packager
