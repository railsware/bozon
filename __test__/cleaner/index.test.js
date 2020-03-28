import { clear } from 'cleaner'

import { emptyDir } from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'

jest.unmock('cleaner')

describe('clear', () => {
  beforeEach(async () => await clear())

  it('shows spinner', () => {
    expect(ora).toHaveBeenCalledWith({
      color: 'cyan',
      text: 'Cleaning app directory'
    })
    expect(ora.start).toHaveBeenCalled()
  })

  it('clears directories', () => {
    expect(emptyDir).toHaveBeenNthCalledWith(1, '/test/home/builds')
    expect(emptyDir).toHaveBeenNthCalledWith(2, '/test/home/packages')
    expect(emptyDir).toHaveBeenNthCalledWith(3, '/test/home/.tmp')
  })

  it('stops spinner with success message', () => {
    expect(chalk.cyan).toHaveBeenCalledWith('Cleaned app directory')
    expect(ora.succeed).toHaveBeenCalledWith('Cleaned app directory')
  })
})
