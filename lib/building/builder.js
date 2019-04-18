const fs = require('fs')
const ora = require('ora')
const copy = require('copy')
const chalk = require('chalk')
const webpack = require('webpack')
const bozon = require('../bozon')
const WebpackConfig = require('./webpack')
const Settings = require('../utils/settings')

class Builder {
  constructor(platform, environment) {
    this.platform = platform
    this.environment = environment
    this.spinner = ora({
      text: chalk.cyan('Building Electron app'),
      color: 'cyan'
    })
  }

  run() {
    this.spinner.start()
    return Promise.all([
      this.copy('*.html', ''),
      this.copy('images/**/*', 'images'),
      this.copy('javascripts/main/**/*.*', 'javascripts/main'),
      this.copy('node_modules/**/*.*', 'node_modules'),
      this.bundle()
    ]).then(() => {
      this.manifest()
    })
  }

  manifest() {
    var json = require(bozon.sourcePath('package.json'))
    var settings = new Settings()
    json.settings = settings.get()
    fs.writeFileSync(
      bozon.destinationPath('package.json', this.environment),
      JSON.stringify(json),
      'utf-8'
    )
    this.spinner.succeed()
  }

  bundle() {
    const webpackConfig = new WebpackConfig(this.environment).build()
    webpack(webpackConfig, (error, stats) => {
      this.spinner.stopAndPersist({text: chalk.green('Watching for changes..'), symbol: '👀'})
      if (stats.compilation.errors.length) {
        this.spinner.fail(chalk.red('Webpack failed to bundle application'))
        console.log(stats.compilation.errors)
      }
      if (stats.compilation.warnings.length) {
        this.spinner.fail(chalk.warn('Webpack bundled application with warnings'))
        console.log(stats.compilation.warnings)
      }
    })
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
