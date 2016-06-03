#! /usr/bin/env node
var path = require('path')
var program = require('commander')
var runner = require('./runner')
var json = require('../../package.json')

program
  .version(json.version)

program
  .command('new <name>')
  .description('Generate scaffold for new Electron application')
  .action(function (name, options) {
    runner.new(name, options)
  })

program
  .command('start')
  .description('Compile and run application')
  .action(function () {
    runner.start()
  })

program
  .command('test [spec]')
  .description('Run tests from spec/ directory')
  .action(function (spec) {
    runner.test(spec)
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    runner.clear()
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    runner.package()
  })

program.parse(process.argv)
