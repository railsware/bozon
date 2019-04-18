const ora = require('ora')
const copy = require('copy')
const chalk = require('chalk')
const webpack = require('webpack')
const chokidar = require('chokidar')
const electron = require('electron')
const bozon = require('../utils/bozon')
const WebpackConfig = require('./webpack')

class Builder {
  constructor(platform, environment) {
    this.platform = platform
    this.environment = environment
    this.webpackConfig = new WebpackConfig(this.environment, this.platform).build()
    this.spinner = ora({
      text: chalk.cyan('Building Electron application'),
      color: 'cyan'
    })
  }

  run() {
    this.spinner.start()
    return Promise.all([
      this.copy('*.html', ''),
      this.copy('*.json', ''),
      this.copy('images/**/*', 'images'),
      this.copy('node_modules/**/*.*', 'node_modules'),
      this.bundle()
    ]).then(() => {
      this.spinner.succeed()
    }).catch((error) => {
      this.spinner.fail('Failed to build application')
      console.error(error)
    })
  }

  bundle() {
    webpack(this.webpackConfig[0], (e, stats) => this.webpackCallback(e, stats))
    webpack(this.webpackConfig[1], (e, stats) => this.webpackCallback(e, stats))
  }

  webpackCallback(error, stats) {
    if(error || stats.hasErrors()) {
      this.spinner.fail(chalk.red('Webpack failed to bundle application'))
      console.log(stats.compilation.errors)
    }
    if (stats.compilation.warnings.length) {
      this.spinner.fail(chalk.yellow('Webpack bundled application with warnings'))
      console.log(stats.compilation.warnings)
    }
  }

  copy(input, output) {
    return new Promise((resolve, reject) => {
      copy(
        bozon.sourcePath(input),
        bozon.destinationPath(output, this.environment),
        (error, file) => {
          if (error) {
            return reject(error)
          } else {
            return resolve()
          }
        }
      )
    })
  }
}

module.exports = Builder
