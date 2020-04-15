import { spawn } from 'child_process'
import { Starter } from 'starter'
import { Builder } from 'builder'
import Checker from 'utils/checker'
import { startSpinner, stopSpinner } from 'utils/logger'

jest.unmock('starter')

jest.spyOn(console, 'log').mockImplementation()
jest.mock('child_process')
jest.mock('utils/logger')
jest.mock('utils/checker')

const setup = async (flags) => {
  await Starter.run({ flags: flags, options: [{ inspect: true }] })
}

describe('Starter', () => {
  describe('Build successful', () => {
    describe('with reload flag', () => {
      beforeEach(() => setup({ reload: true }))

      it('ensures process is run in app directory', () => {
        expect(Checker.ensure).toHaveBeenCalled()
      })

      it('logs application start', () => {
        expect(startSpinner).toHaveBeenCalledWith('Starting application')
      })

      it('runs builder with platform and env', () => {
        expect(Builder.run).toHaveBeenCalledWith(
          'linux',
          'development',
          {
            reload: true
          }
        )
      })

      it('runs electron app', () => {
        expect(spawn).toHaveBeenCalledWith(
          'npx',
          ['nodemon', '-w builds/development/main', '-e js',
            '-q', 'node_modules/.bin/electron', 'builds/development', { inspect: true }],
          { env: {}, shell: true, stdio: 'inherit' }
        )
      })

      it('stops spinner with success', () => {
        expect(stopSpinner).toHaveBeenCalledWith('Starting application')
      })
    })

    describe('without reload flag', () => {
      beforeEach(() => setup({ reload: false }))

      it('runs builder with platform and env', () => {
        expect(Builder.run).toHaveBeenCalledWith(
          'linux',
          'development',
          {
            reload: false
          }
        )
      })

      it('runs electron app', () => {
        expect(spawn).toHaveBeenCalledWith(
          'npx',
          ['electron', 'builds/development', { inspect: true }],
          { env: {}, shell: true, stdio: 'inherit' }
        )
      })
    })
  })

  describe('Build unsuccessful', () => {
    beforeEach(() => {
      Builder.__setBuildError('Unknown error')
      setup()
    })

    it('should not log application start', () => {
      expect(startSpinner).toHaveBeenCalledTimes(0)
    })

    it('should not run electron app', () => {
      expect(spawn).toHaveBeenCalledTimes(0)
    })
  })
})
