var del = require('del')
var path = require('path')
var bozon = require('./bozon')
var Generator = require('./scaffolding/generator')
var SpecRunner = require('./testing/spec_runner')

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

  test: function (args) {
    new SpecRunner(args).run()
  }
}

module.exports = runner
