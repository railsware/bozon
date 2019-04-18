const path = require('path')
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
    this.config = new WebpackConfig(this.environment, this.platform).build()
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
      this.copy('images/**/*'),
      this.copy('node_modules/**/*.*', 'node_modules'),
      this.bundle(this.config.renderer),
      this.bundle(this.config.main)
    ]).then(() => {
      this.spinner.succeed()
      if (this.environment === 'development') {
        this.watch()
      }
    }).catch((error) => {
      this.spinner.fail('Failed to build application')
      console.error(error)
    })
  }

  bundle(config, callback) {
    return new Promise((resolve, reject) => {
      webpack(config, (error, stats) => {
        if (error || stats.hasErrors()) {
          this.spinner.fail(chalk.red('Webpack failed to bundle application'))
          console.log(stats.compilation.errors)
          return reject(error)
        }
        if (stats.compilation.warnings.length) {
          this.spinner.fail(chalk.yellow('Webpack bundled application with warnings'))
          console.log(stats.compilation.warnings)
        }
        if (callback) callback()
        return resolve()
      })
    })
  }

  copy(input, output, callback) {
    return new Promise((resolve, reject) => {
      copy(
        bozon.sourcePath(input),
        bozon.destinationPath(output, this.environment),
        (error, file) => {
          if (error) {
            return reject(error)
          } else {
            if (callback) callback()
            return resolve()
          }
        }
      )
    })
  }

  watch() {
    let watcher = chokidar.watch(bozon.sourcePath('**/*.*'), {
      ignored: /node_modules/,
      persistent: true
    })
    watcher.on('ready', () => {
      this.spinner.stopAndPersist({text: chalk.green('Watching for changes..'), symbol: '👀'})
    })
    watcher.on('change', (file, stats) => {
      this.log(chalk.green('CHANGE'), `File '${chalk.yellow(path.relative(bozon.source(), file))}' has been changed`)
      if (file.match(/javascripts\/main/)) {
        let key = chalk.grey('~MAIN~')
        this.log(key, 'Compiling..')
        this.bundle(this.config.main, () => this.log(key, chalk.cyan('Done')))
      } else if (file.match(/\.html/)) {
        let key = chalk.grey('RENDER')
        this.log(key, 'Updating..')
        this.copy('*.html', '', () => this.log(key, chalk.cyan('Done')))
      } else if (file.match(/\.json/)) {
        let key = chalk.grey('RENDER')
        this.log(key, 'Updating..')
        this.copy('*.json', '', () => this.log(key, chalk.cyan('Done')))
      } else {
        let key = chalk.grey('RENDER')
        this.log(key, 'Compiling..')
        this.bundle(this.config.renderer, () => this.log(key, chalk.cyan('Done')))
      }
    })
  }

  log(key, message) {
    let time = this.timestamp()
    console.log(`[${chalk.grey(time)}] [${key}] ${message}`)
  }

  timestamp() {
    let date = new Date()
    let hours = String(date.getHours()).padStart(2, "0")
    let minutes = String(date.getMinutes()).padStart(2, "0")
    let seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }
}

module.exports = Builder
