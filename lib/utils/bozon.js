const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const childProcess = require('child_process')
const Settings = require('./settings')

const bozon = {
  Settings: Settings,

  defaultWebpackConfig: {
    target: "electron-renderer",
    output: {
      filename: "application.js"
    }
  },

  src: function (suffix) {
    let sources;
    if (Array.isArray(suffix)) {
      sources = suffix.map(this.sourcePath.bind(this))
    } else {
      sources = this.sourcePath(suffix)
    }
    return gulp.src(sources)
  },

  dest: function (suffix) {
    return gulp.dest(this.destinationPath(suffix))
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

  runElectron: function (options) {
    if (typeof options === 'undefined') { options = [] }
    options = options.concat([path.join(process.cwd(), 'builds', 'development')])
    return this.spawn(this.binary('electron'), options)
  },

  spawnSync: function (command, options) {
    return childProcess.spawnSync(command, options, {
      shell: true,
      stdio: 'inherit'
    })
  },

  spawn: function(command, options) {
    return childProcess.spawn(command, options, {
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
    let settings = new Settings()
    return path.join(process.cwd(), 'builds', settings.env(), suffix)
  },

  webpackConfig: function () {
    let webpackConfig = path.join(process.cwd(), '/webpack.config.js')
    let settings = new Settings()
    let mode = settings.env() === 'test' ? 'development' : settings.env()
    let config = (fs.existsSync(webpackConfig)) ? require(webpackConfig) : this.defaultWebpackConfig
    config.mode = mode
    return config
  },

  hooks: []
}

module.exports = bozon
