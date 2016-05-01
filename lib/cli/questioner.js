var inquirer = require('inquirer')
var chalk = require('chalk')
var _ = require('underscore.string')

var Questioner = function (options) {
  this.name = options.name
}

Questioner.prototype.questions = function () {
  return [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your app?',
      default: this.name,
      validate: function (value) {
        return _.isBlank(value) ? 'You have to provide application name' : true
      }
    }, {
      type: 'checkbox',
      name: 'platforms',
      message: 'Which platforms do you want to target?',
      choices: [{
        name: 'Mac Os',
        value: 'darwin-x64'
      }, {
        name: 'Windows x32',
        value: 'win32-ia32'
      }, {
        name: 'Windows x64',
        value: 'win32-x64'
      }, {
        name: 'Linux x32',
        value: 'linux-ia32'
      }, {
        name: 'Linux x64',
        value: 'linux-x64'
      }],
      validate: function (value) {
        return value.length > 0 ? true : 'You have to specify at least one platform'
      }
    }
  ]
}

Questioner.prototype.prompt = function (callback) {
  console.log(' ')
  console.log('  Welcome to ' + chalk.cyan('Bozon') + '!')
  console.log('  You\'re about to start new' + chalk.cyan(' Electron ') + 'application,')
  console.log('  but first answer a few questions about your project:')
  console.log(' ')
  return inquirer.prompt(this.questions()).then(function (answers) {
    callback(answers)
  })
}

module.exports = Questioner
