import chalk from 'chalk'
import webpack from 'webpack'
import { log } from 'utils'

const WEBPACK_ERROR = chalk.red('Webpack failed to bundle application')
const WEBPACK_WARN = chalk.yellow('Webpack bundled application with warnings')

export const bundle = (config, spinner = null) => {
  return new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error || stats.hasErrors()) {
        if (spinner) spinner.fail(WEBPACK_ERROR)
        log(stats.compilation.errors)
        return reject(error)
      }
      if (stats.compilation.warnings.length) {
        if (spinner) spinner.fail(WEBPACK_WARN)
        log(stats.compilation.warnings)
      }
      return resolve()
    })
  })
}
