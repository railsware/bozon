import { create, start, clear, pack, test } from 'runner'

import Generator from 'generator'
import Start from 'starter'
import Cleaner from 'cleaner'
import Packager from 'packager'
import TestRunner from 'test_runner'

describe('create', () => {
  it('passes app name to generator', () => {
    create('myapp')
    expect(Generator).toHaveBeenCalledWith('myapp', undefined)
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
    start()
    expect(Start).toHaveBeenCalled()
    expect(Start.run).toHaveBeenCalled()
  })

  it('starts the app with inspect option', () => {
    start({ inspect: true })
    expect(Start).toHaveBeenCalledWith({ inspect: true })
    expect(Start.run).toHaveBeenCalled()
  })
})

describe('clear', () => {
  it('calls cleaner', () => {
    clear()
    expect(Cleaner).toHaveBeenCalled()
    expect(Cleaner.run).toHaveBeenCalled()
  })
})

describe('package', () => {
  it('calls packager with publish option', () => {
    pack('mac', true)
    expect(Packager).toHaveBeenCalledWith('mac', 'production', true)
    expect(Packager.build).toHaveBeenCalled()
  })

  it('calls packager without publish option', () => {
    pack('windows')
    expect(Packager).toHaveBeenCalledWith('windows', 'production', false)
    expect(Packager.build).toHaveBeenCalled()
  })
})

describe('test', () => {
  it('calls test runner without options', () => {
    test()
    expect(TestRunner).toHaveBeenCalled()
    expect(TestRunner.run).toHaveBeenCalled()
  })

  it('calls test runner with options', () => {
    test({ timeout: 5000 })
    expect(TestRunner).toHaveBeenCalledWith({ timeout: 5000 })
    expect(TestRunner.run).toHaveBeenCalled()
  })
})
