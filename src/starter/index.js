import bozon from 'utils/bozon'
import ora from 'ora'
import chalk from 'chalk'
import Checker from 'utils/checker'
import Builder from 'builder'

export default class Starter {
  constructor(options) {
    Checker.ensure()
    this.options = options
    this.environment = 'development'
    this.spinner = ora({
      text: chalk.cyan('Starting application\n'),
      color: 'cyan'
    })
  }

  run() {
    this.builder = new Builder(bozon.platform(), this.environment)
    this.builder.run().then(() => {
      this.spinner.start()
      bozon.runElectron(this.options)
      this.spinner.succeed(`${chalk.cyan('Starting application:')} ${chalk.green('Done')}\n`)
    }).catch(error => bozon.log(error))
  }
}