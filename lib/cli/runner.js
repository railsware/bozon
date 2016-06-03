var del = require('del')
var path = require('path')
var bozon = require('../bozon')
var Generator = require('./generator')

var runner = {
  new: function (name, options) {
    new Generator(name, options).generate()
  },

  start: function () {
    bozon.runGulp(['start']);
  },

  test: function (spec) {
    if (!spec) {
      spec = bozon.specPath()
    }
    if (spec.match(/spec\/features/) || spec.match(/spec\/?$/)) {
      bozon.runGulp(['package:test'])
    }
    bozon.runMocha(['--recursive', spec])
  },

  clear: function () {
    del([path.join(process.cwd(), 'builds', "**")])
    del([path.join(process.cwd(), 'packages', "**")])
    del([path.join(process.cwd(), '.tmp', "**")])
  },

  package: function () {
    bozon.runGulp(['package']);
  }
}

module.exports = runner;
