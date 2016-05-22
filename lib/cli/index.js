#! /usr/bin/env node
var program = require('commander')
var json = require('../../package.json')

var spawn = function (command, options) {
  require('child_process').spawn(command, options, {
    shell: true,
    stdio: 'inherit'
  })
}

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
    spawn('gulp', ['start'])
  })

program
  .command('test')
  .description('Compile and run application')
  .action(function () {
    spawn('gulp', ['test'])
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    spawn('gulp', ['clear'])
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    spawn('gulp', ['package'])
  })

program.parse(process.argv)
