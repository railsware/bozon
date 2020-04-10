import TestRunner from 'test_runner'
import Checker from 'utils/checker'
import { runMocha } from 'utils'
import { log } from 'utils/logger'

jest.mock('fs')
jest.mock('utils/checker')
jest.mock('utils/logger')
jest.unmock('test_runner')

describe('TestRunner', () => {
  beforeEach(async () => {
    const runner = new TestRunner([{ timeout: 5000 }])
    await runner.run()
  })

  it('ensures process is run in app directory', () => {
    expect(Checker.ensure).toHaveBeenCalled()
  })

  it('shows spinner', () => {
    expect(log).toHaveBeenCalledWith('Running test suite...')
  })

  it('calls mocha', () => {
    expect(runMocha).toHaveBeenCalledWith([
      '--recursive',
      './spec',
      '--timeout',
      2000,
      '--exit'
    ])
  })
})
