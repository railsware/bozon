#! /usr/bin/env node
var program = require('commander')
var shell = require('shelljs')

var Generator = require('./generator')

program
  .version('0.1.0')

program
  .command('new <name>')
  .description('Generate scaffold for new Electron application')
  .option('-c, --coffee', 'Use CoffeeScript as main language')
  .option('-s, --sass', 'User sass syntax for your css')
  .action(function (name, options) {
    var bozon = new Generator(name, options)
    bozon.generate()
  })

program
  .command('start')
  .description('Compile and run application')
  .action(function () {
    shell.exec('gulp start')
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    shell.exec('gulp clear')
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    shell.exec('gulp package')
  })

program.parse(process.argv)
