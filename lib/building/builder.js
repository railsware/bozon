var bozon = require('../bozon')

class Builder {
  constructor(platform, environment) {
    this.platform = platform
    this.environment = environment
  }

  run() {
    bozon.runGulp([
      'prepare:app',
      '--platform=' + this.platform,
      '--env=' + this.environment
    ])
  }
}

module.exports = Builder
