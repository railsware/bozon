import inquirer from 'inquirer'
import chalk from 'chalk'
import { isBlank } from 'underscore.string'

export default class Questionnaire {
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
        validate: value => {
          return isBlank(value) ? 'You have to provide application name' : true
        }
      }, {
        type: 'input',
        name: 'author',
        message: 'Please specify author name (ex: John Doe):',
        validate: value => {
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
    return inquirer.prompt(this.questions()).then(answers => {
      callback(answers)
    })
  }
}
