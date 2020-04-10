import { Starter } from 'starter'
import { Builder } from 'builder'
import Checker from 'utils/checker'
import { runElectron } from 'utils'
import { startSpinner, stopSpinner } from 'utils/logger'

jest.unmock('starter')

jest.spyOn(console, 'log').mockImplementation()
jest.mock('utils/logger')
jest.mock('utils/checker')

const setup = async () => {
  await Starter.run({ flags: { reload: false }, options: [{ inspect: true }] })
}

describe('Starter', () => {
  describe('Build successful', () => {
    beforeEach(() => setup())

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
          reload: false
        }
      )
    })

    it('runs electron app', () => {
      expect(runElectron).toHaveBeenCalled()
    })

    it('stops spinner with success', () => {
      expect(stopSpinner).toHaveBeenCalledWith('Starting application ✓')
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
      expect(runElectron).toHaveBeenCalledTimes(0)
    })
  })
})
