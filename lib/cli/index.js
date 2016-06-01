#! /usr/bin/env node
var path = require('path')
var program = require('commander')
var bozon = require('../bozon')
var json = require('../../package.json')

program
  .version(json.version)

program
  .command('new <name>')
  .description('Generate scaffold for new Electron application')
  .action(function (name, options) {
    var Generator = require('./generator')
    new Generator(name, options).generate()
  })

program
  .command('start')
  .description('Compile and run application')
  .action(function () {
    bozon.runGulp(['start'])
  })

program
  .command('test [spec]')
  .description('Run tests from spec/ directory')
  .action(function (spec) {
    if (!spec) {
      spec = bozon.specPath()
    }
    if (spec.match(/spec\/features/) || spec.match(/spec\/?$/)) {
      bozon.runGulp(['package:test'])
    }
    bozon.runMocha(['--recursive', spec])
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    bozon.runGulp(['clear'])
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    bozon.runGulp(['package'])
  })

program.parse(process.argv)
