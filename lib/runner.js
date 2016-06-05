var del = require('del')
var path = require('path')
var bozon = require('./bozon')
var Generator = require('./generator')

var runner = {
  new: function (name, options) {
    new Generator(name, options).generate()
  },

  start: function () {
    var settings = new bozon.Settings()
    bozon.compile(settings.platform(), 'development')
    bozon.runElectron()
  },

  clear: function () {
    del([path.join(process.cwd(), 'builds', '**')])
    del([path.join(process.cwd(), 'packages', '**')])
    del([path.join(process.cwd(), '.tmp', '**')])
  },

  package: function (platform) {
    bozon.compile(platform, 'production')
    bozon.package(platform, 'production')
  },

  test: function (spec) {
    if (!spec) {
      spec = bozon.specPath()
    }
    var settings = new bozon.Settings()
    if (spec.match(/spec\/features/) || spec.match(/spec\/?$/)) {
      bozon.compile(settings.platform(), 'test')
      bozon.package(settings.platform(), 'test').then(function () {
        bozon.runMocha(['--recursive', spec])
      })
    } else {
      bozon.runMocha(['--recursive', spec])
    }
  }
}

module.exports = runner
