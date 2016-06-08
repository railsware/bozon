var path = require('path')
var bozon = require('./../bozon')
var utils = require('./../utils')

var SpecRunner = (function () {
  function SpecRunner (specPath) {
    var _this = this

    this.compilers = {
      coffee: 'coffee-script/register',
      ts: 'typescript-require'
    }

    this.settings = new bozon.Settings()

    if (!specPath) {
      this.specPath = bozon.specPath()
    } else {
      this.specPath = path.resolve(process.cwd(), specPath)
    }

    function mochaOptions () {
      var options = ['--recursive', _this.specPath]
      return registerCompilers(options)
    }

    function registerCompilers (options) {
      var extensions = filteredExtensions()
      if (extensions.length > 0) {
        options.push('--compilers')
      }
      extensions.forEach(function (extension) {
        options.push(extension + ':' + _this.compilers[extension])
      })
      return options
    }

    function filteredExtensions () {
      var array = []
      utils.uniqFileExtensions(_this.specPath).forEach(function (extension) {
        if (Object.keys(_this.compilers).indexOf(extension) !== -1) {
          array.push(extension)
        }
      })
      return array
    }

    function shouldPackageApp () {
      return _this.specPath.match(/spec\/features/) ||
        _this.specPath.match(/spec\/?$/)
    }

    return {
      run: function () {
        if (shouldPackageApp()) {
          bozon.compile(_this.settings.platform(), 'test')
          bozon.package(_this.settings.platform(), 'test').then(function () {
            bozon.runMocha(mochaOptions())
          })
        } else {
          bozon.runMocha(mochaOptions())
        }
      }
    }
  }

  return SpecRunner
}
)()

module.exports = SpecRunner
