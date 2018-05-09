var bozon = require('../bozon')

class Runner {
  constructor(platform, environment, task) {
    this.platform = platform
    this.environment = environment
    this.task = task
  }

  run() {
    bozon.runGulp([
      this.task,
      '--platform=' + this.platform,
      '--env=' + this.environment
    ])
  }
}

module.exports = Runner
