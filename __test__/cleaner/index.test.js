import Cleaner from 'cleaner'

import del from 'del'
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
    expect(del).toHaveBeenNthCalledWith(1, [
      '/test/home/builds/**',
      '/test/home/packages/**',
      '/test/home/.tmp/**'
    ])
  })

  it('stops spinner with success message', () => {
    expect(chalk.cyan).toHaveBeenCalledWith('Cleaned app directory')
    expect(ora.succeed).toHaveBeenCalledWith('Cleaned app directory')
  })
})
