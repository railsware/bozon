var path = require('path')
var childProcess = require('child_process')
var chalk = require('chalk')
var ejs = require('ejs')
var fs = require('fs')
var _ = require('underscore.string')
var json = require('../package.json')

var $ = path.join

var Generator = function (name, options) {
  this.name = _.underscored(name)
  this.defaults.name = _.classify(name)
  this.options = options
}

function mkdir () {
  return fs.mkdirSync(path.join.apply(this, arguments))
}

Generator.prototype.defaults = {
  name: 'BozonApp',
  year: (new Date()).getFullYear(),
  bozonVersion: json.version,
  electronVersion: json.dependencies['electron-prebuilt'],
  platforms: ['linux-x64', 'darwin-x64', 'win32-ia32'],
  platformsStr: '["linux-x64", "darwin-x64", "win32-ia32"]'
}

Generator.prototype.generate = function () {
  var self = this
  var Questioner = require('./questioner')
  var questioner = new Questioner({name: this.defaults.name})
  questioner.prompt(function (answers) {
    self.defaults.name = _.classify(answers.name)
    self.defaults.platformsStr = '["' + answers.platforms.join('", "') + '"]'
    self.setup()
  })
}

Generator.prototype.setup = function () {
  this.createDirectories()
  this.copyTemplates()
  this.installPackages()
}

Generator.prototype.createDirectories = function () {
  mkdir(this.name)
  mkdir(this.name, 'app')
  mkdir(this.name, 'app', 'images')
  mkdir(this.name, 'app', 'stylesheets')
  mkdir(this.name, 'app', 'javascripts')
  mkdir(this.name, 'app', 'javascripts', 'main')
  mkdir(this.name, 'app', 'javascripts', 'renderer')
  mkdir(this.name, 'config')
  mkdir(this.name, 'config', 'environments')
  mkdir(this.name, 'config', 'platforms')
  mkdir(this.name, 'spec')
  mkdir(this.name, 'spec', 'units')
  mkdir(this.name, 'spec', 'features')
}

Generator.prototype.copyTemplates = function () {
  this.copyTpl('gitignore', '.gitignore')
  this.copyTpl($('json', 'development_package.json'), 'package.json', this.defaults)
  this.copyTpl('gulpfile.js', 'gulpfile.js')
  this.copyTpl('license', 'LICENSE', this.defaults)
  this.copyTpl('readme.md', 'README.md', this.defaults)
  this.copyTpl('index.html', $('app', 'index.html'))
  this.copyTpl($('json', 'production_package.json'), $('app', 'package.json'), this.defaults)
  this.copy($('images', 'electron.icns'), $('app', 'images', 'electron.icns'))
  this.copy($('images', 'electron.ico'), $('app', 'images', 'electron.ico'))
  this.copy($('images', 'electron.png'), $('app', 'images', 'electron.png'))
  this.copyTpl($('stylesheets', 'application.css'), $('app', 'stylesheets', 'application.css'))
  this.copyTpl($('javascripts', 'main.js'), $('app', 'javascripts', 'main', 'index.js'))
  this.copyTpl($('javascripts', 'application.js'), $('app', 'javascripts', 'renderer', 'application.js'))
  this.copyTpl($('json', 'settings.json'), $('config', 'settings.json'))
  this.copyTpl($('json', 'development.json'), $('config', 'environments', 'development.json'))
  this.copyTpl($('json', 'production.json'), $('config', 'environments', 'production.json'))
  this.copyTpl($('json', 'test.json'), $('config', 'environments', 'test.json'))
  for (var i = 0; i < this.defaults.platforms.length; i++) {
    var name = this.defaults.platforms[i].split('-')[0]
    this.copyTpl($('json', name + '.json'), $('config', 'platforms', name + '.json'))
  }
  this.copyTpl($('spec', 'main_spec.js'), $('spec', 'features', 'main_spec.js'))
  this.copyTpl($('spec', 'helper.js'), $('spec', 'helper.js'), this.defaults)
}

Generator.prototype.installPackages = function () {
  console.log('  Running' + chalk.cyan(' npm install') + '..')
  childProcess.spawnSync('npm', [ 'install' ], {
    cwd: './' + this.name,
    shell: true,
    stdio: 'inherit'
  })
}

Generator.prototype.copy = function (src, dest) {
  var template = $(__dirname, 'templates', src)
  var destination = $(process.cwd(), this.name, dest)
  fs.writeFileSync(destination, fs.readFileSync(template))
  console.log('  ' + chalk.green('create') + ' ' + dest)
}

Generator.prototype.copyTpl = function (src, dest, data) {
  if (typeof data === 'undefined') { data = {} }
  var template = $(__dirname, 'templates', src)
  var destination = $(process.cwd(), this.name, dest)
  var str = fs.readFileSync(template, 'utf8')

  fs.writeFileSync(destination, ejs.render(str, data))
  console.log('  ' + chalk.green('create') + ' ' + dest)
}

module.exports = Generator
