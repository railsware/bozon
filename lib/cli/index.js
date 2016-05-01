#! /usr/bin/env node
var program = require('commander')
var childProcess = require('child_process')

var Generator = require('./generator')

program
  .version('0.1.0')

program
  .command('new <name>')
  .description('Generate scaffold for new Electron application')
  .action(function (name, options) {
    new Generator(name, options).generate()
  })

program
  .command('start')
  .description('Compile and run application')
  .action(function () {
    childProcess.spawn('gulp', ['start'], { stdio: 'inherit' })
  })

program
  .command('test')
  .description('Compile and run application')
  .action(function () {
    childProcess.spawn('gulp', ['test'], { stdio: 'inherit' })
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    childProcess.spawn('gulp', ['clear'], { stdio: 'inherit' })
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    childProcess.spawn('gulp', ['package'], { stdio: 'inherit' })
  })

program.parse(process.argv)
