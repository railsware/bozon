var path = require('path')
var gulp = require('gulp')
var childProcess = require('child_process')
var Settings = require('./settings')
var Packager = require('./packager')

var bozon = {
  Settings: Settings,

  task: function () {
    return gulp.task.apply(gulp, arguments)
  },

  buildTask: function () {
    this.hooks.push(arguments[0])
    return gulp.task.apply(gulp, arguments)
  },

  src: function (suffix) {
    return gulp.src(this.sourcePath(suffix))
  },

  dest: function (suffix) {
    return gulp.dest(this.destinationPath(suffix))
  },

  buildTaskAfter: function () {
    var index = this.hooks.indexOf(arguments[0])
    this.hooks.splice(~index ? index + 1 : this.hooks.length, 0, arguments[1])
    return gulp.task.apply(gulp, Array.prototype.slice.call(arguments, 1))
  },

  buildTaskBefore: function () {
    var index = this.hooks.indexOf(arguments[0])
    this.hooks.splice(~index ? index : this.hooks.length, 0, arguments[1])
    return gulp.task.apply(gulp, Array.prototype.slice.call(arguments, 1))
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
    return bozon.spawnSync(this.binary('electron'), ['./builds/development'])
  },

  compile: function (platform, environment) {
    bozon.runGulp(['compile', '--env=' + environment, '--platform=' + platform])
  },

  package: function (platform, environment) {
    var packager = new Packager(platform, environment)
    return packager.build()
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

  specPath: function () {
    return path.join(process.cwd(), 'spec')
  },

  hooks: []
}

module.exports = bozon
