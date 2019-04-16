var bozon = require('../bozon')

class Builder {
  constructor(platform, environment) {
    this.platform = platform
    this.environment = environment
  }

  run() {
    bozon.runGulp([
      'build',
      '--platform=' + this.platform,
      '--env=' + this.environment
    ])
  }
}

module.exports = Builder
