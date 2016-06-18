var bozon = require('../bozon')
var Builder = require('../building/builder')

var Starter = (function () {
  function Starter () {
    this.env = 'development'
    this.settings = new bozon.Settings()
  }

  Starter.prototype.run = function () {
    new Builder(this.settings.platform(), this.env).run()
    bozon.runElectron()
  }
  return Starter
}
)()

module.exports = Starter
