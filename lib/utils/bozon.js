var fs = require('fs')
var path = require('path')
var childProcess = require('child_process')
var Settings = require('./settings')

var bozon = {
  Settings: Settings,

  defaultWebpackConfig: {
    target: "electron",
    output: {
      filename: "application.js"
    }
  },

  task: function () {
    return this.requireLocal('gulp').task.apply(this.requireLocal('gulp'), arguments)
  },

  buildTask: function () {
    var gulp = this.requireLocal('gulp')
    this.hooks.push(arguments[0])
    return gulp.task.apply(gulp, arguments)
  },

  src: function (suffix) {
    var sources;
    if (Array.isArray(suffix)) {
      sources = suffix.map(this.sourcePath.bind(this))
    } else {
      sources = this.sourcePath(suffix)
    }
    return this.requireLocal('gulp').src(sources)
  },

  dest: function (suffix) {
    return this.requireLocal('gulp').dest(this.destinationPath(suffix))
  },

  buildTaskAfter: function () {
    var gulp = this.requireLocal('gulp')
    var index = this.hooks.indexOf(arguments[0])
    this.hooks.splice(~index ? index + 1 : this.hooks.length, 0, arguments[1])
    return gulp.task.apply(gulp, Array.prototype.slice.call(arguments, 1))
  },

  buildTaskBefore: function () {
    var gulp = this.requireLocal('gulp')
    var index = this.hooks.indexOf(arguments[0])
    this.hooks.splice(~index ? index : this.hooks.length, 0, arguments[1])
    return gulp.task.apply(gulp, Array.prototype.slice.call(arguments, 1))
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
    return childProcess.spawnSync(command, options, {
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

  webpackConfig: function () {
    var webpackConfig = path.join(process.cwd(), '/webpack.config.js')

    if (fs.existsSync(webpackConfig)) {
      return require(webpackConfig)
    } else {
      return this.defaultWebpackConfig
    }
  },

  hooks: []
}

module.exports = bozon
