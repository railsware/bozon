const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const bozon = {
  srcDir: "app",

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
