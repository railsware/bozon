import fs from 'fs'
import path from 'path'
import ora from 'ora'
import copy from 'copy'
import chalk from 'chalk'
import webpack from 'webpack'
import chokidar from 'chokidar'
import bozon from 'utils/bozon'
import WebpackConfig from 'builder/webpack_config'

export default class Builder {
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
    return Promise.all(this.buildQueue())
      .then(() => {
        this.manifest()
        this.spinner.succeed(
          `${chalk.cyan('Building Electron application:')} ${chalk.green('Done')}`)
        if (this.environment === 'development') {
          this.watch()
        }
      })
      .catch((error) => {
        this.spinner.fail(chalk.cyan(`${chalk.cyan('Building Electron application:')} ${chalk.yellow('Failed')}`))
        throw error
      })
  }

  buildQueue() {
    const queue = [
      this.copy('renderer/*.html', 'renderer'),
      this.copy('images/**/*', 'images'),
      this.bundle(this.config.renderer),
      this.bundle(this.config.main)
    ]
    if (this.config.preload) queue.push(this.bundle(this.config.preload))
    return queue
  }

  bundle(config, callback) {
    return new Promise((resolve, reject) => {
      webpack(config, (error, stats) => {
        if (error || stats.hasErrors()) {
          this.spinner.fail(chalk.red('Webpack failed to bundle application'))
          bozon.log(stats.compilation.errors)
          return reject(error)
        }
        if (stats.compilation.warnings.length) {
          this.spinner.fail(
            chalk.yellow('Webpack bundled application with warnings')
          )
          bozon.log(stats.compilation.warnings)
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

  manifest() {
    return new Promise((resolve, reject) => {
      const json = JSON.parse(fs.readFileSync(bozon.source('package.json')))
      const settings = {
        name: json.name,
        version: json.version,
        description: json.description,
        author: json.author || 'Anonymous',
        main: 'main/index.js',
        repository: json.repository
      }
      fs.writeFile(
        bozon.destinationPath('package.json', this.environment),
        JSON.stringify(settings),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  watch() {
    const watcher = chokidar.watch(bozon.sourcePath('**/*.*'), {
      ignored: /node_modules/,
      persistent: true
    })
    watcher.on('ready', () => {
      this.spinner.stopAndPersist({
        text: chalk.green('Watching for changes..\n'),
        symbol: '👀'
      })
    })
    watcher.on('change', (file, stats) => {
      this.log(
        chalk.green('CHANGE'),
        `File '${chalk.yellow(
          path.relative(bozon.source(), file)
        )}' has been changed`
      )
      if (file.match(/main/)) {
        const key = chalk.grey('~MAIN~')
        this.log(key, 'Compiling..')
        this.bundle(this.config.main, () => this.log(key, chalk.cyan('Done')))
      } else if (file.match(/\.html/)) {
        const key = chalk.grey('RENDER')
        this.log(key, 'Updating..')
        this.copy('*.html', '', () => this.log(key, chalk.cyan('Done')))
      } else if (file.match(/\.json/)) {
        const key = chalk.grey('RENDER')
        this.log(key, 'Updating..')
        this.copy('*.json', '', () => this.log(key, chalk.cyan('Done')))
      } else {
        const key = chalk.grey('RENDER')
        this.log(key, 'Compiling..')
        this.bundle(this.config.renderer, () =>
          this.log(key, chalk.cyan('Done'))
        )
      }
    })
  }

  log(key, message) {
    const time = this.timestamp()
    bozon.log(`[${chalk.grey(time)}] [${key}] ${message}`)
  }

  timestamp() {
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }
}
