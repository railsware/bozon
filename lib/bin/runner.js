var Generator   = require('./../scaffolding/generator')
var Starter     = require('./../starting/starter')
var Packager    = require('./../packaging/packager')
var Cleaner     = require('./../clearing/cleaner')
var SpecRunner  = require('./../testing/spec_runner')

var runner = {
  new: function (name, options) {
    new Generator(name, options).generate()
  },

  start: function (options) {
    new Starter(options).run()
  },

  clear: function () {
    new Cleaner().run()
  },

  package: function (platform, publish = false) {
    new Packager(platform, 'production', publish).build()
  },

  test: function (options) {
    return new SpecRunner(options).run()
  }
}

module.exports = runner
