var bozon = require('../bozon')

var Builder = (function () {
  function Builder (platform, environment) {
    this.platform = platform
    this.environment = environment
  }

  Builder.prototype.run = function () {
    bozon.runGulp([
      'prepare:app',
      '--platform=' + this.platform,
      '--env=' + this.environment
    ])
  }

  return Builder
}
)()

module.exports = Builder
