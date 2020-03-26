import Starter from 'starter'
import Builder from 'builder'
import Checker from 'utils/checker'
import ora from 'ora'
import { runElectron } from 'utils/bozon'

jest.unmock('starter')

jest.spyOn(console, 'log').mockImplementation()

jest.mock('utils/checker')
jest.mock('utils/bozon')

const setup = async () => {
  const starter = new Starter([{ inspect: true }])
  await starter.run()
}

describe('Starter', () => {
  describe('Build successful', () => {
    beforeEach(() => setup())

    it('ensures process is run in app directory', () => {
      expect(Checker.ensure).toHaveBeenCalled()
    })

    it('sets up spinner', () => {
      expect(ora).toHaveBeenCalledWith({
        color: 'cyan',
        text: 'Starting application\n'
      })
    })

    it('instantiates builder with platform and env', async () => {
      expect(Builder).toHaveBeenCalledWith('mac', 'development')
    })

    it('runs builder', () => {
      expect(Builder.run).toHaveBeenCalled()
    })

    it('starts spinner', () => {
      expect(ora.start).toHaveBeenCalled()
    })

    it('runs electron app', () => {
      expect(runElectron).toHaveBeenCalled()
    })

    it('stops spinner with success', () => {
      expect(ora.succeed).toHaveBeenCalledWith('Starting application: Done\n')
    })
  })

  describe('Build unsuccessful', () => {
    beforeEach(() => {
      Builder.__setBuildError('Unknown error')
      setup()
    })

    it('should not start spinner', () => {
      expect(ora.start).toHaveBeenCalledTimes(0)
    })

    it('should not run electron app', () => {
      expect(runElectron).toHaveBeenCalledTimes(0)
    })
  })
})
