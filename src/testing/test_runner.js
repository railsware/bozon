const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const utils = require('./utils')
const Checker = require('../utils/checker')
const Packager = require('./../packaging/packager')
const bozon = require('./../utils/bozon')

class TestRunner {
  constructor(options) {
    Checker.ensure()
    this.compilers = {
      coffee: 'coffeescript/register',
      ts: 'ts-node/register'
    }
    this.specPath = !options.path ? this.testDir() : options.path
    this.timeout = !options.timeout ? 2000 : options.timeout
    this.spinner = ora({
      text: chalk.cyan('Running test suite'),
      color: 'cyan'
    })
  }

  run() {
    return new Promise((resolve) => {
      if (this.shouldPackageApp()) {
        var packager = new Packager(bozon.platform(), 'test')
        packager.build().then(() => {
          resolve(bozon.runMocha(this.mochaOptions()))
        })
      } else {
        resolve(bozon.runMocha(this.mochaOptions()))
      }
    })
  }

  testDir() {
    return fs.existsSync(bozon.source('test')) ? './test' : './spec'
  }

  mochaOptions() {
    this.spinner.succeed()
    var options = ['--recursive', this.specPath]
    options = this.registerCompilers(options)
    return this.addCommandOptions(options)
  }

  registerCompilers(options) {
    var extensions = this.filteredExtensions()
    if (extensions.length > 0) {
      options.push('--require')
    }
    extensions.forEach((extension) => {
      options.push(this.compilers[extension])
    })
    if (extensions.length > 0) {
      options.push('--extension')
      options.push(extensions.join(','))
    }
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
    return this.specPath.match(/(spec|test)\/?$/) ||
      this.specPath.match(/feature/)
  }
}

module.exports = TestRunner
