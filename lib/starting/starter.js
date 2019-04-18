const bozon = require('../bozon')
const ora = require('ora')
const chalk = require('chalk')
const Settings = require('../utils/settings')
const Checker = require('../utils/checker')
const Builder = require('../building/builder')

class Starter {
  constructor(options) {
    this.options = options
    Checker.ensure()
    this.env = 'development'
    this.settings = new Settings()
    this.spinner = ora({
      text: chalk.cyan('Starting application'),
      color: 'cyan'
    })
  }

  run() {
    this.builder = new Builder(this.settings.platform(), this.env)
    this.builder.run().then(() => {
      this.spinner.start()
      bozon.runElectron(this.options)
      this.spinner.succeed()
    })
  }
}

module.exports = Starter
