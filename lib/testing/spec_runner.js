var path = require('path')
var utils = require('./utils')
var Checker = require('../utils/checker')
var Packager = require('./../packaging/packager')
var Settings = require('./../utils/settings')
var bozon = require('./../bozon')

class SpecRunner {

  constructor(options) {
    Checker.ensure()
    this.settings = new Settings()
    this.compilers = {
      coffee: 'coffee-script/register',
      ts: 'typescript-require'
    }
    if (!options.path) {
      options.path = 'spec'
    }
    if (!options.timeout) {
      options.timeout = 2000
    }
    this.specPath = path.resolve(process.cwd(), options.path)
    this.timeout = options.timeout
  }

  run() {
    return new Promise( (resolve) => {
      if (this.shouldPackageApp()) {
        var packager = new Packager(this.settings.platform(), 'test')
        packager.build().then(() => {
          resolve(bozon.runMocha(this.mochaOptions()))
        }).catch((err) => {
          console.log(err)
        })
      } else {
        resolve(bozon.runMocha(this.mochaOptions()))
      }
    })
  }

  mochaOptions() {
    var options = ['--recursive', this.specPath]
    options = this.registerCompilers(options)
    return this.addCommandOptions(options)
  }

  registerCompilers(options) {
    var extensions = this.filteredExtensions()
    if (extensions.length > 0) {
      options.push('--compilers')
    }
    extensions.forEach((extension) => {
      options.push(extension + ':' + this.compilers[extension])
    })
    return options
  }

  addCommandOptions(options) {
    options.push('--timeout')
    options.push(this.timeout)
    options.push('--exit')
    return options
  }

  filteredExtensions() {
    var array = []
    utils.uniqFileExtensions(this.specPath).forEach((extension) => {
      if (Object.keys(this.compilers).indexOf(extension) !== -1) {
        array.push(extension)
      }
    })
    return array
  }

  shouldPackageApp() {
    return this.specPath.match(/spec\/features/) ||
      this.specPath.match(/spec\/?$/)
  }

}

module.exports = SpecRunner
