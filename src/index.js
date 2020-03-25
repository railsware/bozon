import commander from 'commander'
import json from '../package.json'
import { create, start, clear, pack, test, run } from './runner'

commander
  .version(json.version)
  .usage('[options]')

commander
  .command('new <name>')
  .option('--skip-install')
  .description('Generate scaffold for new Electron application')
  .action(function (name, command) {
    let options = {
      skipInstall: command.skipInstall !== undefined
    }
    create(name, options)
  })

commander
  .command('start')
  .alias('s')
  .option('--inspect <port>')
  .option('--inspect-brk <port>')
  .description('Compile and run application')
  .action(function (command) {
    let options
    if (command.inspect) {
      options = ['--inspect='+command.inspect]
    } else if (command.inspectBrk) {
      options = ['--inspect-brk='+command.inspectBrk]
    } else {
      options = []
    }
    start(options)
  })

commander
  .command('test [spec]')
  .option('--timeout <miliseconds>')
  .description('Run tests from spec/ directory')
  .action(function (path, command) {
    let options = {
      path: path,
      timeout: command.timeout
    }
    test(options).then(function(result) {
      process.exit(result.status);
    })
  })

commander
  .command('clear')
  .description('Clear builds and releases directories')
  .action(function () {
    clear()
  })

commander
  .command('package <platform>')
  .option('--publish')
  .description('Build and Package applications for platforms defined in package.json')
  .action(function (platform, command) {
    pack(platform, command.publish)
  })

commander
  .command('run <task>')
  .description('Run the defined task')
  .action(function (task) {
    run(task)
  })

commander.parse(process.argv)

if (!process.argv.slice(2).length) {
  commander.outputHelp()
}
