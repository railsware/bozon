import inquirer from 'inquirer'
import chalk from 'chalk'
import { isBlank } from 'underscore.string'

export default class Questioner {
  constructor(options) {
    this.name = options.name
  }

  questions() {
    return [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your app?',
        default: this.name,
        validate: function (value) {
          return isBlank(value) ? 'You have to provide application name' : true
        }
      }, {
        type: 'input',
        name: 'author',
        message: 'Please specify author name (ex: John Doe):',
        validate: function (value) {
          return isBlank(value) ? 'You have to provide author name' : true
        }
      }
    ]
  }

  prompt(callback) {
    console.log(' ')
    console.log('  Welcome to ' + chalk.cyan('Bozon') + '!')
    console.log('  You\'re about to start new' + chalk.cyan(' Electron ') + 'application,')
    console.log('  but first answer a few questions about your project:')
    console.log(' ')
    return inquirer.prompt(this.questions()).then(function (answers) {
      callback(answers)
    })
  }
}
