var path = require('path')
var shell = require('shelljs')
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

Generator.prototype.copyTpl = function (src, dest, data) {
  if (typeof data === 'undefined') {
    data = {}
  }
  var self = this
  var template = path.join(__dirname, '..', 'templates', src)
  var destination = path.join(self.appDir, dest)

  var str = fs.readFileSync(template, 'utf8')//, function (err, str) {
  // if (err) throw err

  fs.writeFileSync(destination, ejs.render(str, data))//, function (err) {
    // if (err) throw err

  console.log('  ' + chalk.green('create') + ' ' + dest)
  // })
  // })
}

Generator.prototype.generate = function () {
  shell.mkdir(this.name)
  shell.mkdir($(this.name, 'app'))
  shell.mkdir($(this.name, 'app', 'images'))
  shell.mkdir($(this.name, 'app', 'stylesheets'))
  shell.mkdir($(this.name, 'app', 'javascripts'))
  shell.mkdir($(this.name, 'app', 'javascripts', 'main'))
  shell.mkdir($(this.name, 'app', 'javascripts', 'browser'))
  shell.mkdir($(this.name, 'config'))
  shell.mkdir($(this.name, 'config', 'environments'))
  shell.mkdir($(this.name, 'config', 'platforms'))
  this.copyTpl('gitignore', '.gitignore')
  this.copyTpl($('json', 'development_package.json'), 'package.json', {name: _.classify(this.name)})
  this.copyTpl('bower.json', 'bower.json', {name: _.underscored(this.name)})
  this.copyTpl('gulpfile.coffee', 'gulpfile.coffee')
  this.copyTpl('index.html', $('app', 'index.html'))
  this.copyTpl($('json', 'production_package.json'), $('app', 'package.json'), {name: _.classify(this.name)})
  this.copyTpl($('javascripts', 'main.coffee'), $('app', 'javascripts', 'main', 'index.coffee'))
  this.copyTpl($('javascripts', 'application.coffee'), $('app', 'javascripts', 'browser', 'application.coffee'))
  this.copyTpl($('stylesheets', 'application.sass'), $('app', 'stylesheets', 'application.sass'))
  this.copyTpl($('json', 'settings.json'), $('config', 'settings.json'))
  this.copyTpl($('json', 'development.json'), $('config', 'environments', 'development.json'))
  this.copyTpl($('json', 'production.json'), $('config', 'environments', 'production.json'))
  this.copyTpl($('json', 'test.json'), $('config', 'environments', 'test.json'))
  this.copyTpl($('json', 'darwin.json'), $('config', 'platforms', 'darwin.json'))
  this.copyTpl($('json', 'linux.json'), $('config', 'platforms', 'linux.json'))
  this.copyTpl($('json', 'win32.json'), $('config', 'platforms', 'win32.json'))
  // shell.cd(this.name)
  shell.exec('npm --prefix ./' + this.name + ' install ' + ' ./' + this.name, function (code, stdout) {
    console.log(stdout)
  })
}

module.exports = Generator
