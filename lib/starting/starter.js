var bozon = require('../bozon')
var Checker = require('../utils/checker')
var Builder = require('../building/builder')

class Starter {
  constructor(options) {
    this.options = options
    Checker.ensure()
    this.env = 'development'
    this.settings = new bozon.Settings()
  }

  run() {
    new Builder(this.settings.platform(), this.env).run()
    bozon.runElectron(this.options)
    bozon.runGulp(['watch'])
  }
}

module.exports = Starter
