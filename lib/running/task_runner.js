var bozon = require('../bozon')

var Runner = (function () {
  function Runner (platform, environment, task) {
    this.platform = platform
    this.environment = environment
		this.task = task
  }

  Runner.prototype.run = function () {
		bozon.runGulp([
      this.task,
      '--platform=' + this.platform,
      '--env=' + this.environment
    ])
  }

  return Runner
}
)()

module.exports = Runner
