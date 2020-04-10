import Questionnaire from 'generator/questionnaire'
import inquirer from 'inquirer'

jest.unmock('generator/questionnaire')
jest.spyOn(console, 'log').mockImplementation()

const callback = jest.fn()

describe('Questionnaire', () => {
  beforeEach(async () => {
    const questionnaire = new Questionnaire({ name: 'myapp' })
    await questionnaire.prompt(callback)
  })

  it('prints welcome message', () => {
    expect(console.log).toHaveBeenCalledWith('  Welcome to Bozon!')
    expect(console.log).toHaveBeenCalledWith('  You\'re about to start new Electron application,')
    expect(console.log).toHaveBeenCalledWith('  but first answer a few questions about your project:')
  })

  it('asks questions', () => {
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        default: 'myapp',
        message: 'What is the name of your app?',
        name: 'name',
        type: 'input',
        validate: expect.any(Function)
      },
      {
        message: 'Please specify author name (ex: John Doe):',
        name: 'author',
        type: 'input',
        validate: expect.any(Function)
      },
      {
        message: 'Which package manager do you use?',
        choices: ['yarn', 'npm'],
        name: 'packageManager',
        type: 'list'
      } 
    ])
  })

  it('calls a callback with answers', () => {
    expect(callback).toHaveBeenCalledWith({ name: 'myapp', author: 'John Doe' })
  })
})
