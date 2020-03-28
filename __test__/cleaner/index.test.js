import Cleaner from 'cleaner'

import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'

jest.unmock('cleaner')

describe('Cleaner', () => {
  beforeEach(() => {
    const cleaner = new Cleaner()
    cleaner.run()
  })

  it('shows spinner', () => {
    expect(ora).toHaveBeenCalledWith({
      color: 'cyan',
      text: 'Cleaning app directory'
    })
    expect(ora.start).toHaveBeenCalled()
  })

  it('clears directories', () => {
    expect(fs.remove).toHaveBeenNthCalledWith(1, '/test/home/builds')
    expect(fs.remove).toHaveBeenNthCalledWith(2, '/test/home/packages')
    expect(fs.remove).toHaveBeenNthCalledWith(3, '/test/home/.tmp')
  })

  it('stops spinner with success message', () => {
    expect(chalk.cyan).toHaveBeenCalledWith('Cleaned app directory')
    expect(ora.succeed).toHaveBeenCalledWith('Cleaned app directory')
  })
})
