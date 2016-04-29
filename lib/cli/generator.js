var path = require('path')
var childProcess = require('child_process')
var chalk = require('chalk')
var ejs = require('ejs')
var fs = require('fs')
var _ = require('underscore.string')

var $ = path.join

var Generator = function (name, options) {
  this.name = name
  this.options = options
  this.appDir = path.join('.', name)
}

Generator.prototype.getTpl = function (file) {
  return path.join(__dirname, '..', 'templates', file)
}

Generator.prototype.copy = function (src, dest) {
  var template = path.join(__dirname, '..', 'templates', src)
  var destination = path.join(this.appDir, dest)
  childProcess.exec('cp', template, destination)
  console.log('  ' + chalk.green('create') + ' ' + dest)
}

Generator.prototype.copyTpl = function (src, dest, data) {
  if (typeof data === 'undefined') { data = {} }
  var template = path.join(__dirname, '..', 'templates', src)
  var destination = path.join(this.appDir, dest)
  var str = fs.readFileSync(template, 'utf8')

  fs.writeFileSync(destination, ejs.render(str, data))
  console.log('  ' + chalk.green('create') + ' ' + dest)
}

Generator.prototype.setupDirs = function () {
  fs.mkdirSync(this.name)
  fs.mkdirSync($(this.name, 'app'))
  fs.mkdirSync($(this.name, 'app', 'images'))
  fs.mkdirSync($(this.name, 'app', 'stylesheets'))
  fs.mkdirSync($(this.name, 'app', 'javascripts'))
  fs.mkdirSync($(this.name, 'app', 'javascripts', 'main'))
  fs.mkdirSync($(this.name, 'app', 'javascripts', 'browser'))
  fs.mkdirSync($(this.name, 'config'))
  fs.mkdirSync($(this.name, 'config', 'environments'))
  fs.mkdirSync($(this.name, 'config', 'platforms'))
  fs.mkdirSync($(this.name, 'spec'))
}

Generator.prototype.copyTemplates = function () {
  this.copyTpl('gitignore', '.gitignore')
  this.copyTpl($('json', 'development_package.json'), 'package.json', {name: _.classify(this.name)})
  this.copyTpl('gulpfile.coffee', 'gulpfile.coffee')
  this.copyTpl('index.html', $('app', 'index.html'))
  this.copyTpl($('json', 'production_package.json'), $('app', 'package.json'), {name: _.classify(this.name)})
  this.copy($('images', 'electron.icns'), $('app', 'images', 'electron.icns'))
  this.copy($('images', 'electron.ico'), $('app', 'images', 'electron.ico'))
  this.copy($('images', 'electron.png'), $('app', 'images', 'electron.png'))
  this.copyTpl($('stylesheets', 'application.sass'), $('app', 'stylesheets', 'application.sass'))
  this.copyTpl($('javascripts', 'main.coffee'), $('app', 'javascripts', 'main', 'index.coffee'))
  this.copyTpl($('javascripts', 'application.coffee'), $('app', 'javascripts', 'browser', 'application.coffee'))
  this.copyTpl($('json', 'settings.json'), $('config', 'settings.json'))
  this.copyTpl($('json', 'development.json'), $('config', 'environments', 'development.json'))
  this.copyTpl($('json', 'production.json'), $('config', 'environments', 'production.json'))
  this.copyTpl($('json', 'test.json'), $('config', 'environments', 'test.json'))
  this.copyTpl($('json', 'darwin.json'), $('config', 'platforms', 'darwin.json'))
  this.copyTpl($('json', 'linux.json'), $('config', 'platforms', 'linux.json'))
  this.copyTpl($('json', 'win32.json'), $('config', 'platforms', 'win32.json'))
  this.copyTpl($('spec', 'main_spec.coffee'), $('spec', 'main_spec.coffee'))
  this.copyTpl($('spec', 'helper.coffee'), $('spec', 'helper.coffee'), { name: _.classify(this.name) })
}

Generator.prototype.installPackages = function () {
  console.log(chalk.yellow('  Running') + chalk.green(' npm install') + chalk.yellow('..'))
  childProcess.spawnSync('npm', [ '--prefix', './' + this.name, 'install', './' + this.name ], { stdio: 'inherit' })
}

Generator.prototype.generate = function () {
  this.setupDirs()
  this.copyTemplates()
  this.installPackages()
}

module.exports = Generator
