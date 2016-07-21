var path = require('path')
var utils = require('./utils')
var Packager = require('./../packaging/packager')
var Settings = require('./../utils/settings')
var bozon = require('./../bozon')

var SpecRunner = (function () {
  function SpecRunner (specPath) {
    var _this = this

    this.compilers = {
      coffee: 'coffee-script/register',
      ts: 'typescript-require'
    }

    this.settings = new Settings()

    if (!specPath) {
      this.specPath = path.resolve(process.cwd(), 'spec')
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
        return new Promise(function (resolve) {
          if (shouldPackageApp()) {
            var packager = new Packager(_this.settings.platform(), 'test')
            packager.build().then(function () {
              console.log()
              resolve(bozon.runMocha(mochaOptions()))
            }).catch(function (err) {
              console.log(err)
            })
          } else {
            resolve(bozon.runMocha(mochaOptions()))
          }
        });
      }
    }
  }

  return SpecRunner
}
)()

module.exports = SpecRunner
