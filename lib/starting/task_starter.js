var bozon = require('../bozon')
var Checker = require('../utils/checker')
var Runner = require('../running/task_runner.js')

class TaskStarter {
  constructor() {
    Checker.ensure()
    this.env = 'development'
    this.settings = new bozon.Settings()
    this.task = task
  }

  run() {
    new Runner(this.settings.platform(), this.env, this.task).run()
  }
}

module.exports = TaskStarter
