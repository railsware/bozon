import path from 'path'
import { emptyDir } from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'

const DIRECTORIES = ['builds', 'packages', '.tmp']

export const clear = async () => {
  const spinner = createSpinner('Cleaning app directory')
  spinner.start()
  await Promise.all(DIRECTORIES.map((dir) => clearDir(dir)))
  spinner.succeed(chalk.cyan('Cleaned app directory'))
}

const createSpinner = (message) => {
  return ora({ text: chalk.cyan(message), color: 'cyan' })
}

const clearDir = (dir) => {
  return emptyDir(path.join(process.cwd(), dir))
}
