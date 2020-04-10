import { create, start, pack, test } from 'runner'

import Generator from 'generator'
import { Starter } from 'starter'
import Packager from 'packager'
import TestRunner from 'test_runner'

jest.spyOn(process, 'exit').mockImplementation()

describe('create', () => {
  it('passes app name to generator', () => {
    create('myapp', {})
    expect(Generator).toHaveBeenCalledWith('myapp', { skipInstall: false })
    expect(Generator.generate).toHaveBeenCalled()
  })

  it('passes app name and options to generator', () => {
    create('myapp', { skipInstall: true })
    expect(Generator).toHaveBeenCalledWith('myapp', { skipInstall: true })
    expect(Generator.generate).toHaveBeenCalled()
  })
})

describe('start', () => {
  it('starts the app without options', () => {
    start({})
    expect(Starter.run).toHaveBeenCalled()
  })

  it('starts the app with inspect option', () => {
    start({ inspect: true })
    expect(Starter.run).toHaveBeenCalledWith({
      flags: {
        reload: false
      },
      options: ['--inspect=true']
    })
  })
})

describe('test', () => {
  it('calls test runner without options', () => {
    test('test/index.test.js', {})
    expect(TestRunner).toHaveBeenCalledWith({
      path: 'test/index.test.js',
      timeout: undefined
    })
    expect(TestRunner.run).toHaveBeenCalled()
  })

  it('calls test runner with options', () => {
    test('test/index.test.js', { timeout: 5000 })
    expect(TestRunner).toHaveBeenCalledWith({
      path: 'test/index.test.js',
      timeout: 5000
    })
    expect(TestRunner.run).toHaveBeenCalled()
  })

  it('calls process exit on successful run', async () => {
    await test('test/index.test.js', {})
    expect(process.exit).toHaveBeenCalled()
  })
})

describe('package', () => {
  it('calls packager with publish option', () => {
    pack('mac', { publish: true })
    expect(Packager).toHaveBeenCalledWith('mac', 'production', true)
    expect(Packager.build).toHaveBeenCalled()
  })

  it('calls packager without publish option', () => {
    pack('windows', {})
    expect(Packager).toHaveBeenCalledWith('windows', 'production', false)
    expect(Packager.build).toHaveBeenCalled()
  })
})
