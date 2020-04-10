import path from 'path'
import { emptyDir } from 'fs-extra'
import chalk from 'chalk'
import { startSpinner, stopSpinner } from 'utils/logger'

const DIRECTORIES = ['builds', 'packages', '.tmp']

export const clear = async () => {
  startSpinner(chalk.bold('Cleaning app directory'))
  await Promise.all(DIRECTORIES.map((dir) => clearDir(dir)))
  stopSpinner(`${chalk.bold('Cleaned app directory')} ${chalk.green('✓')}`)
}

const clearDir = (dir) => {
  return emptyDir(path.join(process.cwd(), dir))
}
