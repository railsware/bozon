import { clear } from 'cleaner'

import { emptyDir } from 'fs-extra'

import { startSpinner, stopSpinner } from 'utils/logger'

jest.unmock('cleaner')
jest.mock('utils/logger')

describe('clear', () => {
  beforeEach(async () => await clear())

  it('shows spinner', () => {
    expect(startSpinner).toHaveBeenCalledWith('Cleaning app directory')
  })

  it('clears directories', () => {
    expect(emptyDir).toHaveBeenNthCalledWith(1, '/test/home/builds')
    expect(emptyDir).toHaveBeenNthCalledWith(2, '/test/home/packages')
    expect(emptyDir).toHaveBeenNthCalledWith(3, '/test/home/.tmp')
  })

  it('stops spinner with success message', () => {
    expect(stopSpinner).toHaveBeenCalledWith('Cleaned app directory')
  })
})
