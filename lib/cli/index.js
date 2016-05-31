#! /usr/bin/env node
var path = require('path')
var program = require('commander')
var json = require('../../package.json')

var runGulp = function (command) {
  var gulp = path.join(process.cwd(), 'node_modules', '.bin', 'gulp')

  require('child_process').spawn(gulp, [command], {
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
    runGulp('start')
  })

program
  .command('test')
  .description('Compile and run application')
  .action(function () {
    runGulp('test')
  })

program
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    runGulp('clear')
  })

program
  .command('package')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function () {
    runGulp('package')
  })

program.parse(process.argv)
