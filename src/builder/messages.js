import chalk from 'chalk'

export const BUILD_START = chalk.cyan('Building Electron application')
export const BUILD_FAILED = `${chalk.cyan('Building Electron application:')} ${chalk.yellow('Failed')}`
export const BUILD_SUCCEED = `${chalk.cyan('Building Electron application:')} ${chalk.green('Done')}`
