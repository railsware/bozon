import Generator from 'generator'
import Questionnaire from 'generator/questionnaire'
import fs from 'fs'

jest.spyOn(console, 'log').mockImplementation()
jest.unmock('generator')
jest.mock('generator/questionnaire')
jest.mock('fs')
jest.mock('child_process')

describe('Generator', () => {
  beforeEach(async () => {
    const generator = new Generator('myapp', {})
    await generator.generate()
  })

  it('builds questionnaire with default name', () => {
    expect(Questionnaire).toHaveBeenCalledWith({ name: 'Myapp' })
  })

  it('calls questionnaire prompt', () => {
    expect(Questionnaire.prompt).toHaveBeenCalledWith(expect.any(Function))
  })

  it('creates directory structure', () => {
    [
      'myapp',
      'myapp/src',
      'myapp/src/main',
      'myapp/src/renderer',
      'myapp/src/preload',
      'myapp/src/renderer/images',
      'myapp/src/renderer/stylesheets',
      'myapp/src/renderer/javascripts',
      'myapp/config',
      'myapp/config/environments',
      'myapp/config/platforms',
      'myapp/resources',
      'myapp/test',
      'myapp/test/units',
      'myapp/test/features'
    ].forEach(dir => {
      expect(fs.mkdirSync).toHaveBeenCalledWith(dir)
    })
  })

  it('copies templates to directory structure', () => {
    [
      ['/test/home/myapp/.gitignore', 'gitignore contents'],
      ['/test/home/myapp/package.json', 'development_package.json contents'],
      ['/test/home/myapp/jest.config.js', 'jest.config.js contents'],
      ['/test/home/myapp/webpack.config.js', 'webpack.config.js contents'],
      ['/test/home/myapp/LICENSE', 'license contents'],
      ['/test/home/myapp/README.md', 'readme.md contents'],
      ['/test/home/myapp/src/main/index.js', 'main.js contents'],
      ['/test/home/myapp/src/preload/index.js', 'preload.js contents'],
      ['/test/home/myapp/src/renderer/index.html', 'index.html contents'],
      ['/test/home/myapp/src/renderer/stylesheets/application.css', 'application.css contents'],
      ['/test/home/myapp/src/renderer/javascripts/index.js', 'renderer.js contents'],
      ['/test/home/myapp/resources/icon.icns', 'electron.icns contents'],
      ['/test/home/myapp/resources/icon.ico', 'electron.ico contents'],
      ['/test/home/myapp/config/settings.json', 'settings.json contents'],
      ['/test/home/myapp/config/environments/development.json', 'development.json contents'],
      ['/test/home/myapp/config/environments/production.json', 'production.json contents'],
      ['/test/home/myapp/config/environments/test.json', 'test.json contents'],
      ['/test/home/myapp/config/platforms/windows.json', 'windows.json contents'],
      ['/test/home/myapp/config/platforms/linux.json', 'linux.json contents'],
      ['/test/home/myapp/config/platforms/mac.json', 'mac.json contents'],
      ['/test/home/myapp/test/features/main.test.js', 'main_test.js contents'],
      ['/test/home/myapp/test/setup.js', 'setup.js contents']
    ].forEach(sections => {
      expect(fs.writeFileSync).toHaveBeenCalledWith(sections[0], sections[1])
    })
  })

  it('prints create file message', () => {
    [
      '  create .gitignore',
      '  create package.json',
      '  create jest.config.js',
      '  create webpack.config.js',
      '  create LICENSE',
      '  create README.md',
      '  create src/main/index.js',
      '  create src/preload/index.js',
      '  create src/renderer/index.html',
      '  create src/renderer/stylesheets/application.css',
      '  create src/renderer/javascripts/index.js',
      '  create resources/icon.icns',
      '  create resources/icon.ico',
      '  create config/settings.json',
      '  create config/environments/development.json',
      '  create config/environments/production.json',
      '  create config/environments/test.json',
      '  create config/platforms/windows.json',
      '  create config/platforms/linux.json',
      '  create config/platforms/mac.json',
      '  create test/features/main.test.js',
      '  create test/setup.js'
    ].forEach(message => {
      expect(console.log).toHaveBeenCalledWith(message)
    })
  })

  it('prints post instructions', () => {
    expect(console.log).toHaveBeenCalledWith('Success! Created myapp at /test/home/myapp')
    expect(console.log).toHaveBeenCalledWith('Inside that directory, you can run several commands:')
    expect(console.log).toHaveBeenCalledWith('  bozon start')
    expect(console.log).toHaveBeenCalledWith('    Starts the Electron app in development mode.')
    expect(console.log).toHaveBeenCalledWith('  bozon test')
    expect(console.log).toHaveBeenCalledWith('    Starts the test runner.')
    expect(console.log).toHaveBeenCalledWith('  bozon package <platform>')
    expect(console.log).toHaveBeenCalledWith('    Packages Electron application for specified platform.')
    expect(console.log).toHaveBeenCalledWith('We suggest you to start with typing:')
    expect(console.log).toHaveBeenCalledWith('  cd myapp')
    expect(console.log).toHaveBeenCalledWith('  bozon start')
  })
})
