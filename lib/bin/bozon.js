var program = require('commander')
var runner = require('./runner')
var json = require('../../package.json')

program
  .version(json.version)
  .usage('[options]')

program
  .command('new <name>')
  .description('Generate scaffold for new Electron application')
  .action(function (name) {
    runner.new(name)
  })

program
  .command('start')
  .alias('s')
  .option('--inspect <port>')
  .option('--inspect-brk <port>')
  .description('Compile and run application')
  .action(function (command) {
    if (command.inspect) {
      options = ['--inspect='+command.inspect]
    } else if (command.inspectBrk) {
      options = ['--inspect-brk='+command.inspectBrk]
    } else {
      options = []
    }
    runner.start(options)
  })

program
  .command('test [spec]')
  .description('Run tests from spec/ directory')
  .action(function (spec) {
    runner.test(spec).then(function(result) {
      process.exit(result.status);
    })
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

program
  .command('run <task>')
  .description('Run the defined task')
  .action(function (task) {
    runner.run(task)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
