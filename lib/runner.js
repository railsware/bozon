var del = require('del')
var path = require('path')
var bozon = require('./bozon')
var Generator = require('./generator')

var runner = {
  new: function (name, options) {
    new Generator(name, options).generate()
  },

  start: function () {
    bozon.runGulp(['compile', '--env=development', '--platform=' + process.platform])
    bozon.spawnSync(path.join('.', 'node_modules', '.bin', 'electron'), ['./builds/development'])
  },

  test: function (spec) {
    if (!spec) {
      spec = bozon.specPath()
    }
    if (spec.match(/spec\/features/) || spec.match(/spec\/?$/)) {
      bozon.runGulp(['compile', '--env=test', '--platform=' + process.platform])
      bozon.spawnSync(bozon.packagerPath(), bozon.testPackagingOptions())
    }
    bozon.runMocha(['--recursive', spec])
  },

  clear: function () {
    del([path.join(process.cwd(), 'builds', '**')])
    del([path.join(process.cwd(), 'packages', '**')])
    del([path.join(process.cwd(), '.tmp', '**')])
  },

  package: function () {
    var platforms = bozon.settings().packaging.platforms
    for (var i = 0; i < platforms.length; i++) {
      var os = platforms[i].split('-')[0]
      var arch = platforms[i].split('-')[1]
      bozon.runGulp(['compile', '--env=' + bozon.packagingEnv(), '--platform=' + os])
      bozon.spawnSync(bozon.packagerPath(), bozon.productionPackagingOptions(os, arch))
    }
  }
}

module.exports = runner
