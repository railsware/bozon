const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const Config = require('merge-config')

const bozon = {
  srcDir: "app",

  source: function() {
    let prefix = process.cwd()
    let suffix = path.join.apply(null, arguments)
    return path.join(prefix, suffix)
  },

  config: function(env, platform) {
    let config = new Config()
    config.file(this.source('config', 'settings.json'))
    config.file(this.source('config', 'environments', env + '.json'))
    config.file(this.source('config', 'platforms', platform + '.json'))
    return config.get()
  },

  platform: function () {
    let os = process.platform
    if (os === 'mac' || os === 'darwin') {
      return 'mac'
    } else if (os === 'windows' || os === 'win32') {
      return 'windows'
    } else if (os === 'linux') {
      return 'linux'
    } else {
      throw new Error('Unsupported platform ' + os)
    }
  },

  binary: function (name) {
    return path.join(process.cwd(), 'node_modules', '.bin', name)
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
    return path.join(process.cwd(), this.srcDir, suffix)
  },

  destinationPath: function (suffix, env) {
    if (suffix == null) {
      suffix = ''
    }
    return path.join(process.cwd(), 'builds', env, suffix)
  }
}

module.exports = bozon
