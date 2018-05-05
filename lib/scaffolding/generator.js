var path = require('path')
var childProcess = require('child_process')
var chalk = require('chalk')
var ejs = require('ejs')
var fs = require('fs')
var _ = require('underscore.string')
var json = require('../../package.json')

var $ = path.join

class Generator {

  constructor(name, options) {
    this.name = _.underscored(name)
    this.options = options
    this.defaults = {
      id: 'bozonapp',
      name: _.classify(name),
      author: null,
      year: (new Date()).getFullYear(),
      bozonVersion: json.version,
      electronVersion: json.versions['electron'],
      electronBuilderVersion: json.versions['electron-builder'],
      gulpVersion: json.versions['gulp'],
      mochaVersion: json.versions['mocha'],
      spectronVersion: json.versions['spectron'],
      webpackStreamVersion: json.versions['webpack-stream']
    }
  }

  generate() {
    var self = this
    var Questioner = require('./questioner')
    var questioner = new Questioner({name: this.defaults.name})
    questioner.prompt(function (answers) {
      self.defaults.id = answers.name.toLowerCase()
      self.defaults.name = _.classify(answers.name)
      self.defaults.author = answers.author
      self.setup()
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
    this.mkdir(this.name, 'app')
    this.mkdir(this.name, 'app', 'images')
    this.mkdir(this.name, 'app', 'stylesheets')
    this.mkdir(this.name, 'app', 'javascripts')
    this.mkdir(this.name, 'app', 'javascripts', 'main')
    this.mkdir(this.name, 'app', 'javascripts', 'renderer')
    this.mkdir(this.name, 'config')
    this.mkdir(this.name, 'config', 'environments')
    this.mkdir(this.name, 'config', 'platforms')
    this.mkdir(this.name, 'resources')
    this.mkdir(this.name, 'spec')
    this.mkdir(this.name, 'spec', 'units')
    this.mkdir(this.name, 'spec', 'features')
  }

  copyTemplates() {
    this.copyTpl('gitignore', '.gitignore')
    this.copyTpl($('json', 'development_package.json'), 'package.json', this.defaults)
    this.copyTpl('gulpfile.js', 'gulpfile.js')
    this.copyTpl('webpack.config.js', 'webpack.config.js')
    this.copyTpl('license', 'LICENSE', this.defaults)
    this.copyTpl('readme.md', 'README.md', this.defaults)
    this.copyTpl('index.html', $('app', 'index.html'))
    this.copyTpl($('json', 'production_package.json'), $('app', 'package.json'), this.defaults)
    this.copyTpl($('stylesheets', 'application.css'), $('app', 'stylesheets', 'application.css'))
    this.copyTpl($('javascripts', 'main.js'), $('app', 'javascripts', 'main', 'index.js'))
    this.copyTpl($('javascripts', 'application.js'), $('app', 'javascripts', 'renderer', 'application.js'))
    this.copy($('images', 'electron.icns'), $('resources', 'icon.icns'))
    this.copy($('images', 'electron.ico'), $('resources', 'icon.ico'))
    this.copyTpl($('json', 'settings.json'), $('config', 'settings.json'))
    this.copyTpl($('json', 'development.json'), $('config', 'environments', 'development.json'))
    this.copyTpl($('json', 'production.json'), $('config', 'environments', 'production.json'))
    this.copyTpl($('json', 'test.json'), $('config', 'environments', 'test.json'))
    this.copyTpl($('json', 'windows.json'), $('config', 'platforms', 'windows.json'))
    this.copyTpl($('json', 'linux.json'), $('config', 'platforms', 'linux.json'))
    this.copyTpl($('json', 'mac.json'), $('config', 'platforms', 'mac.json'))
    this.copyTpl($('spec', 'main_spec.js'), $('spec', 'features', 'main_spec.js'))
    this.copyTpl($('spec', 'helper.js'), $('spec', 'helper.js'), this.defaults)
  }

  installPackages() {
    if(!this.options.skipInstall) {
      console.log('  Running ' + chalk.cyan('npm install') + '..')
      childProcess.spawnSync('npm', [ 'install' ], {
        cwd: './' + this.name,
        shell: true,
        stdio: 'inherit'
      })
    } else {
      console.log('  Skipping ' + chalk.cyan('npm install') + '..')
    }
  }

  mkdir() {
    return fs.mkdirSync($.apply(this, arguments))
  }

  copy(src, dest) {
    var template = $(__dirname, '..', 'templates', src)
    var destination = $(process.cwd(), this.name, dest)
    fs.writeFileSync(destination, fs.readFileSync(template))
    console.log('  ' + chalk.green('create') + ' ' + dest)
  }

  copyTpl(src, dest, data) {
    if (typeof data === 'undefined') { data = {} }
    var template = $(__dirname, '..', 'templates', src)
    var destination = $(process.cwd(), this.name, dest)
    var str = fs.readFileSync(template, 'utf8')

    fs.writeFileSync(destination, ejs.render(str, data))
    console.log('  ' + chalk.green('create') + ' ' + dest)
  }

  printInstructions() {
    console.log('')
    console.log(`Success! Created ${this.name} at ${$(process.cwd(), this.name)}`)
    console.log('Inside that directory, you can run several commands:')
    console.log('')
    console.log(chalk.cyan('  bozon start'.padStart(5)))
    console.log('    Starts the Electron app in development mode.')
    console.log('')
    console.log(chalk.cyan('  bozon test'.padStart(5)))
    console.log('    Starts the test runner.')
    console.log('')
    console.log(chalk.cyan('  bozon package <platform>'.padStart(5)))
    console.log('    Packages Electron application for specified platform.')
    console.log('')
    console.log('')
    console.log('We suggest you to start with typing:')
    console.log(chalk.cyan(`  cd ${this.name}`))
    console.log(chalk.cyan('  bozon start'))
    console.log('')
  }
}

module.exports = Generator
