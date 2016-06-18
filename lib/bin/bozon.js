var program = require('commander')
var runner = require('./runner')
var json = require('../../package.json')

program
  .version(json.version)

program
  .command('new <name>')
  .description('Generate scaffold for new Electron application')
  .action(function (name) {
    runner.new(name)
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
  .command('package <platform>')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function (platform) {
    runner.package(platform)
  })

program.parse(process.argv)
