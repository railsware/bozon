#! /usr/bin/env node
var program = require('commander')
var childProcess = require('child_process')
var json = require('../../package.json')

var Generator = require('./generator')

program
  .version(json.version)

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
    childProcess.spawn('gulp', ['start'], {
      shell: true,
      stdio: 'inherit'
    })
  })

program
  .command('test')
  .description('Compile and run application')
  .action(function () {
    childProcess.spawn('gulp', ['test'], {
      shell: true,
      stdio: 'inherit'
    })
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    childProcess.spawn('gulp', ['clear'], {
      shell: true,
      stdio: 'inherit'
    })
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    childProcess.spawn('gulp', ['package'], {
      shell: true,
      stdio: 'inherit'
    })
  })

program.parse(process.argv)
