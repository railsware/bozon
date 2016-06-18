var path = require('path')
var childProcess = require('child_process')
var Settings = require('./settings')

var bozon = {
  Settings: Settings,

  task: function () {
    return this.requireLocal('gulp').task.apply(this.requireLocal('gulp'), arguments)
  },

  buildTask: function () {
    this.hooks.push(arguments[0])
    return this.requireLocal('gulp').task.apply(this.requireLocal('gulp'), arguments)
  },

  src: function (suffix) {
    return this.requireLocal('gulp').src(this.sourcePath(suffix))
  },

  dest: function (suffix) {
    return this.requireLocal('gulp').dest(this.destinationPath(suffix))
  },

  buildTaskAfter: function () {
    var index = this.hooks.indexOf(arguments[0])
    this.hooks.splice(~index ? index + 1 : this.hooks.length, 0, arguments[1])
    return this.requireLocal('gulp').task.apply(gulp, Array.prototype.slice.call(arguments, 1))
  },

  buildTaskBefore: function () {
    var index = this.hooks.indexOf(arguments[0])
    this.hooks.splice(~index ? index : this.hooks.length, 0, arguments[1])
    return this.requireLocal('gulp').task.apply(gulp, Array.prototype.slice.call(arguments, 1))
  },

  requireLocal: function (name) {
    return require(path.join(process.cwd(), 'node_modules', name))
  },

  binary: function (name) {
    return path.join(process.cwd(), 'node_modules', '.bin', name)
  },

  runGulp: function (params) {
    return this.spawnSync(this.binary('gulp'), params)
  },

  runMocha: function (params) {
    return this.spawnSync(this.binary('mocha'), params)
  },

  runElectron: function () {
    return bozon.spawnSync(this.binary('electron'), [path.join(process.cwd(), 'builds', 'development')])
  },

  spawnSync: function (command, options) {
    childProcess.spawnSync(command, options, {
      shell: true,
      stdio: 'inherit'
    })
  },

  sourcePath: function (suffix) {
    if (suffix == null) {
      suffix = ''
    }
    return path.join(process.cwd(), 'app', suffix)
  },

  destinationPath: function (suffix) {
    if (suffix == null) {
      suffix = ''
    }
    var settings = new Settings()
    return path.join(process.cwd(), 'builds', settings.env(), suffix)
  },

  hooks: []
}

module.exports = bozon
