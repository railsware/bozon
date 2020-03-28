import { emptyDir } from 'fs-extra'
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

  async run() {
    this.spinner.start()
    await Promise.all(
      ['builds', 'packages', '.tmp'].map((dir) => {
        emptyDir(path.join(process.cwd(), dir))
      })
    )
    this.spinner.succeed(chalk.cyan('Cleaned app directory'))
  }
}
