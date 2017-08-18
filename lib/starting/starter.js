var bozon = require('../bozon')
var Checker = require('../utils/checker')
var Builder = require('../building/builder')

var Starter = (function () {
  function Starter (options) {
    this.options = options
    Checker.ensure()
    this.env = 'development'
    this.settings = new bozon.Settings()
  }

  Starter.prototype.run = function () {
    new Builder(this.settings.platform(), this.env).run()
    bozon.runElectron(this.options)
  }
  return Starter
}
)()

module.exports = Starter
