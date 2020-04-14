import { spawnSync } from 'child_process'
import { TestRunner } from 'test_runner'
import { subscribeOnExit } from 'utils'
import Checker from 'utils/checker'
import { log } from 'utils/logger'

jest.mock('fs')
jest.mock('child_process')
jest.mock('utils/checker')
jest.mock('utils/logger')
jest.unmock('test_runner')

describe('TestRunner', () => {
  describe('with no path argument', () => {
    beforeEach(async () => {
      await TestRunner.run()
    })

    it('ensures process is run in app directory', () => {
      expect(Checker.ensure).toHaveBeenCalled()
    })

    it('shows spinner', () => {
      expect(log).toHaveBeenCalledWith('Running test suite...')
    })

    it('runs jest twice', () => {
      expect(spawnSync).toHaveBeenCalledTimes(2)
    })

    it('runs jest for unit tests', () => {
      expect(spawnSync).toHaveBeenNthCalledWith(1, 'npx', ['jest', './test/units'], {
        env: {},
        shell: true,
        stdio: 'inherit'
      })
    })

    it('runs jest for feature tests', () => {
      expect(spawnSync).toHaveBeenNthCalledWith(2, 'npx', ['jest', '-i', './test/features'], {
        env: {},
        shell: true,
        stdio: 'inherit'
      })
    })

    it('returns cursor back', () => {
      expect(subscribeOnExit).toHaveBeenCalled()
    })
  })

  describe('with path argument', () => {
    describe('with path to unit test', () => {
      beforeEach(async () => {
        await TestRunner.run('test/units/some.test.js')
      })

      it('ensures process is run in app directory', () => {
        expect(Checker.ensure).toHaveBeenCalled()
      })

      it('shows spinner', () => {
        expect(log).toHaveBeenCalledWith('Running test suite...')
      })

      it('runs jest once', () => {
        expect(spawnSync).toHaveBeenCalledTimes(1)
      })

      it('runs jest for unit tests', () => {
        expect(spawnSync).toHaveBeenNthCalledWith(1, 'npx', ['jest', 'test/units/some.test.js'], {
          env: {},
          shell: true,
          stdio: 'inherit'
        })
      })
    })

    describe('with path to feature test', () => {
      beforeEach(async () => {
        await TestRunner.run('test/features/some.test.js')
      })

      it('ensures process is run in app directory', () => {
        expect(Checker.ensure).toHaveBeenCalled()
      })

      it('shows spinner', () => {
        expect(log).toHaveBeenCalledWith('Running test suite...')
      })

      it('runs jest once', () => {
        expect(spawnSync).toHaveBeenCalledTimes(1)
      })

      it('runs jest for feature tests', () => {
        expect(spawnSync).toHaveBeenNthCalledWith(1, 'npx', ['jest', '-i', 'test/features/some.test.js'], {
          env: {},
          shell: true,
          stdio: 'inherit'
        })
      })
    })
  })
})
