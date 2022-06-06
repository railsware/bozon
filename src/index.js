import commander from 'commander'
import { create, start, build, pack, test, clear } from './runner'
import json from '../package.json'

export const perform = () => {
  commander.version(json.version).usage('[options]')

  commander
    .command('new <name>')
    .option('--skip-install')
    .description('Generate scaffold for new Electron application')
    .action(create)

  commander
    .command('start')
    .alias('s')
    .option('-r, --reload')
    .option('-i, --inspect <port>')
    .option('-b, --inspect-brk <port>')
    .description('Compile and run application')
    .action(start)

  commander
    .command('build [env]')
    .description('Build application to builds/ directory')
    .action(build)

  commander
    .command('test [spec]')
    .description('Run tests from spec/ directory')
    .action(test)

  commander
    .command('clear')
    .description('Clear builds and releases directories')
    .action(clear)

  commander
    .command('package <platform>')
    .option('-p, --publish')
    .description(
      'Build and Package applications for platforms defined in package.json'
    )
    .action(pack)

  commander.parse(process.argv)

  if (!process.argv.slice(2).length) {
    commander.outputHelp()
  }
}
