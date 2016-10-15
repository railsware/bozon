var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var childProcess = require('child_process')

var Checker = {
  files: ['package.json', 'gulpfile.js'],
  ensure: function() {
    this.ensureFilesPresence()
    this.ensureDependencies()
  },

  ensureFilesPresence: function() {
    var _this = this
    this.files.forEach(function(file) {
      try {
        fs.lstatSync(path.join(process.cwd(), file))
      }
      catch (e) {
        _this.log("\n  Could not find "
          + chalk.yellow(file) +
          ".. It doesn't look like you are in electron app root directory.\n")
      }
    })
  },

  ensureDependencies: function() {
    try {
      fs.lstatSync(path.join(process.cwd(), 'node_modules'))
    }
    catch (e) {
      this.log("\n  Run " + chalk.cyan('npm install') +".. \n")
    }
  },

  log: function(error) {
    console.log(error)
    process.exit()
  }
}

module.exports = Checker
