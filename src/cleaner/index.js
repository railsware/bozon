import del from 'del'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

export default class Cleaner {
  constructor() {
    this.spinner = ora({
      text: chalk.cyan('Cleaning app directory'),
      color: 'cyan'
    })
  }

  run() {
    this.spinner.start()
    del([path.join(process.cwd(), 'builds', '**')])
    del([path.join(process.cwd(), 'packages', '**')])
    del([path.join(process.cwd(), '.tmp', '**')])
    this.spinner.succeed(chalk.cyan('Cleaned app directory'))
  }
}
