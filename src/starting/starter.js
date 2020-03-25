const bozon = require('../utils/bozon')
const ora = require('ora')
const chalk = require('chalk')
const Checker = require('../utils/checker')
const Builder = require('../building/builder')

class Starter {
  constructor(options) {
    Checker.ensure()
    this.options = options
    this.environment = 'development'
    this.spinner = ora({
      text: chalk.cyan('Starting application\n'),
      color: 'cyan'
    })
  }

  run() {
    this.builder = new Builder(bozon.platform(), this.environment)
    this.builder.run().then(() => {
      this.spinner.start()
      bozon.runElectron(this.options)
      this.spinner.succeed()
    })
  }
}

module.exports = Starter
