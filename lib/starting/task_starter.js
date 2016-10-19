var bozon = require('../bozon')
var Checker = require('../utils/checker')
var Runner = require('../running/task_runner.js')

var TaskStarter = (function () {
  function TaskStarter (task) {
    Checker.ensure()
    this.env = 'development'
    this.settings = new bozon.Settings()
    this.task = task
  }

  TaskStarter.prototype.run = function () {
    new Runner(this.settings.platform(), this.env, this.task).run()
  }
  return TaskStarter
}
)()

module.exports = TaskStarter
