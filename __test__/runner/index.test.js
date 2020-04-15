import { create, start, pack, test, clear } from 'runner'

import Generator from 'generator'
import { Starter } from 'starter'
import Packager from 'packager'
import { TestRunner } from 'test_runner'
import { Cleaner } from 'cleaner'
import { restoreCursorOnExit } from 'utils'

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

  it('restores cursor', () => {
    start({})
    expect(restoreCursorOnExit).toHaveBeenCalled()
  })
})

describe('test', () => {
  it('calls test runner without options', async () => {
    await test()
    expect(TestRunner.run).toHaveBeenCalled()
  })

  it('calls test runner with path', async () => {
    await test('test/index.test.js')
    expect(TestRunner.run).toHaveBeenCalledWith('test/index.test.js')
  })

  it('restores cursor', async () => {
    await test()
    expect(restoreCursorOnExit).toHaveBeenCalled()
  })

  it('exits with success status', async () => {
    await test()
    expect(process.exit).toHaveBeenCalledWith(0)
  })

  describe('running test fails', () => {
    beforeEach(() => {
      TestRunner.__setError(Error)
    })

    it('exits with error status', async () => {
      await test()
      expect(process.exit).toHaveBeenCalledWith(1)
    })
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

  it('restores cursor', () => {
    pack('mac', {})
    expect(restoreCursorOnExit).toHaveBeenCalled()
  })
})

describe('clear', () => {
  it('calls test runner without options', () => {
    clear()
    expect(Cleaner.run).toHaveBeenCalled()
  })

  it('restores cursor', () => {
    clear()
    expect(restoreCursorOnExit).toHaveBeenCalled()
  })
})
