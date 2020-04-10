import ora from 'ora'
import chalk from 'chalk'
import { ensureDirSync } from 'fs-extra'
import WebpackConfig from 'builder/webpack_config'
import { buildManifest } from 'builder/manifest'
import { buildHTML } from 'builder/html'
import { bundle } from 'builder/bundle'
import { watch } from 'builder/watcher'
import { source, sourcePath, destinationPath } from 'utils'

export const BUILD_START = chalk.cyan('Building Electron application')
export const BUILD_FAILED = `${chalk.cyan('Building Electron application:')} ${chalk.yellow('Failed')}`
export const BUILD_SUCCEED = `${chalk.cyan('Building Electron application:')} ${chalk.green('Done')}`

export default class Builder {
  constructor(platform, environment) {
    this.platform = platform
    this.environment = environment
    this.config = new WebpackConfig(this.environment, this.platform).build()
    this.spinner = ora({ text: BUILD_START, color: 'cyan' })
  }

  run() {
    this.spinner.start()
    ensureDirSync(destinationPath('', this.environment))
    return Promise.all(this.buildQueue())
      .then(() => {
        this.spinner.succeed(BUILD_SUCCEED)
        if (this.environment === 'development') {
          watch(this.config, this.environment, this.spinner)
        }
      })
      .catch((error) => {
        this.spinner.fail(BUILD_FAILED)
        throw error
      })
  }

  buildQueue() {
    return [
      buildHTML(sourcePath('renderer'), destinationPath('renderer', this.environment)),
      buildManifest(source('package.json'), destinationPath('package.json', this.environment)),
      bundle(this.config.renderer, this.spinner),
      bundle(this.config.main, this.spinner),
      bundle(this.config.preload, this.spinner)
    ]
  }
}
