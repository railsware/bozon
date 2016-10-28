var Generator   = require('./../scaffolding/generator')
var Starter     = require('./../starting/starter')
var Packager    = require('./../packaging/packager')
var Cleaner     = require('./../clearing/cleaner')
var SpecRunner  = require('./../testing/spec_runner')
var TaskStarter = require('./../starting/task_starter')

var runner = {
  new: function (name) {
    new Generator(name).generate()
  },

  start: function () {
    new Starter().run()
  },

  clear: function () {
    new Cleaner().run()
  },

  package: function (platform) {
    new Packager(platform, 'production').build()
  },

  test: function (args) {
    return new SpecRunner(args).run()
  },

  run: function (task) {
    new TaskStarter(task).run();
  }
}

module.exports = runner
