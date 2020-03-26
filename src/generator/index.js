import path from 'path'
import childProcess from 'child_process'
import chalk from 'chalk'
import ejs from 'ejs'
import fs from 'fs'
import { classify, underscored } from 'underscore.string'
import Questionnaire from './questionnaire'

import bozon from 'utils/bozon'

import json from '../../package.json'

const $ = path.join

export default class Generator {
  constructor(name, options) {
    this.name = underscored(name)
    this.options = options
    this.defaults = {
      id: 'bozonapp',
      name: classify(name),
      author: null,
      year: new Date().getFullYear(),
      bozonVersion: json.version,
      mochaVersion: json.versions.mocha,
      spectronVersion: json.versions.spectron
    }
    this.questionnaire = new Questionnaire({ name: this.defaults.name })
  }

  generate() {
    this.questionnaire.prompt(answers => {
      this.defaults.id = answers.name.toLowerCase()
      this.defaults.name = classify(answers.name)
      this.defaults.author = answers.author
      this.setup()
    })
  }

  setup() {
    this.createDirectories()
    this.copyTemplates()
    this.installPackages()
    this.printInstructions()
  }

  createDirectories() {
    this.mkdir(this.name)
    this.mkdir(this.name, 'src')
    this.mkdir(this.name, 'src', 'main')
    this.mkdir(this.name, 'src', 'renderer')
    this.mkdir(this.name, 'src', 'preload')
    this.mkdir(this.name, 'src', 'renderer', 'images')
    this.mkdir(this.name, 'src', 'renderer', 'stylesheets')
    this.mkdir(this.name, 'src', 'renderer', 'javascripts')
    this.mkdir(this.name, 'config')
    this.mkdir(this.name, 'config', 'environments')
    this.mkdir(this.name, 'config', 'platforms')
    this.mkdir(this.name, 'resources')
    this.mkdir(this.name, 'test')
    this.mkdir(this.name, 'test', 'units')
    this.mkdir(this.name, 'test', 'features')
  }

  copyTemplates() {
    this.copyTpl('gitignore', '.gitignore')
    this.copyTpl(
      $('json', 'development_package.json'),
      'package.json',
      this.defaults
    )
    this.copyTpl('webpack.config.js', 'webpack.config.js')
    this.copyTpl('license', 'LICENSE', this.defaults)
    this.copyTpl('readme.md', 'README.md', this.defaults)
    this.copyTpl($('javascripts', 'main.js'), $('src', 'main', 'index.js'))
    this.copyTpl(
      $('javascripts', 'preload.js'),
      $('src', 'preload', 'index.js')
    )
    this.copyTpl('index.html', $('src', 'renderer', 'index.html'))
    this.copyTpl(
      $('stylesheets', 'application.css'),
      $('src', 'renderer', 'stylesheets', 'application.css')
    )
    this.copyTpl(
      $('javascripts', 'renderer.js'),
      $('src', 'renderer', 'javascripts', 'index.js')
    )
    this.copy($('images', 'electron.icns'), $('resources', 'icon.icns'))
    this.copy($('images', 'electron.ico'), $('resources', 'icon.ico'))
    this.copyTpl($('json', 'settings.json'), $('config', 'settings.json'))
    this.copyTpl(
      $('json', 'development.json'),
      $('config', 'environments', 'development.json')
    )
    this.copyTpl(
      $('json', 'production.json'),
      $('config', 'environments', 'production.json')
    )
    this.copyTpl(
      $('json', 'test.json'),
      $('config', 'environments', 'test.json')
    )
    this.copyTpl(
      $('json', 'windows.json'),
      $('config', 'platforms', 'windows.json')
    )
    this.copyTpl(
      $('json', 'linux.json'),
      $('config', 'platforms', 'linux.json')
    )
    this.copyTpl($('json', 'mac.json'), $('config', 'platforms', 'mac.json'))
    this.copyTpl(
      $('test', 'main_spec.js'),
      $('test', 'features', 'main_spec.js')
    )
    this.copyTpl($('test', 'helper.js'), $('test', 'helper.js'), this.defaults)
  }

  installPackages() {
    if (!this.options.skipInstall) {
      bozon.log('  Running ' + chalk.cyan('npm install') + '..')
      childProcess.spawnSync('npm', ['install'], {
        cwd: './' + this.name,
        shell: true,
        stdio: 'inherit'
      })
    } else {
      bozon.log('  Skipping ' + chalk.cyan('npm install') + '..')
    }
  }

  mkdir() {
    try {
      return fs.mkdirSync($.apply(this, arguments))
    } catch (err) {
      bozon.log(`\n ${chalk.red(err.message)} \n`)
      process.exit(0)
    }
  }

  copy(src, dest) {
    var template = $(__dirname, '..', 'templates', src)
    var destination = $(process.cwd(), this.name, dest)
    fs.writeFileSync(destination, fs.readFileSync(template))
    bozon.log('  ' + chalk.green('create') + ' ' + dest)
  }

  copyTpl(src, dest, data) {
    if (typeof data === 'undefined') {
      data = {}
    }
    var template = $(__dirname, '..', 'templates', src)
    var destination = $(process.cwd(), this.name, dest)
    var str = fs.readFileSync(template, 'utf8')

    fs.writeFileSync(destination, ejs.render(str, data))
    bozon.log('  ' + chalk.green('create') + ' ' + dest)
  }

  printInstructions() {
    bozon.log('')
    bozon.log(
      `Success! Created ${this.name} at ${$(process.cwd(), this.name)}`
    )
    bozon.log('Inside that directory, you can run several commands:')
    bozon.log('')
    bozon.log(chalk.cyan('  bozon start'.padStart(5)))
    bozon.log('    Starts the Electron app in development mode.')
    bozon.log('')
    bozon.log(chalk.cyan('  bozon test'.padStart(5)))
    bozon.log('    Starts the test runner.')
    bozon.log('')
    bozon.log(chalk.cyan('  bozon package <platform>'.padStart(5)))
    bozon.log('    Packages Electron application for specified platform.')
    bozon.log('')
    bozon.log('')
    bozon.log('We suggest you to start with typing:')
    bozon.log(chalk.cyan(`  cd ${this.name}`))
    bozon.log(chalk.cyan('  bozon start'))
    bozon.log('')
  }
}
