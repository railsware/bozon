import commander from 'commander'

import { perform } from 'index'

jest.unmock('index')

describe('bozon cli', () => {
  beforeEach(() => {
    perform()
  })

  describe('version', () => {
    it('sets current version', () => {
      expect(commander.version).toHaveBeenCalledWith('1.0.0-alpha.1')
    })

    it('sets usage instruction', () => {
      expect(commander.usage).toHaveBeenCalledWith('[options]')
    })
  })

  describe('new', () => {
    it('sets new command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(1, 'new <name>')
    })

    it('adds option to new command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(1, '--skip-install')
    })
  })

  describe('start', () => {
    it('sets start command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(2, 'start')
    })

    it('add alias', () => {
      expect(commander.alias).toHaveBeenNthCalledWith(1, 's')
    })

    it('adds inspect option to start command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(2, '--inspect <port>')
    })

    it('adds inspect-brk option to start command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(
        3,
        '--inspect-brk <port>'
      )
    })
  })

  describe('test', () => {
    it('sets test command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(3, 'test [spec]')
    })

    it('adds timeout option to test command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(
        4,
        '--timeout <miliseconds>'
      )
    })
  })

  describe('clear', () => {
    it('sets clear command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(4, 'clear')
    })
  })

  describe('package', () => {
    it('sets package command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(5, 'package <platform>')
    })

    it('adds publish option to package command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(5, '--publish')
    })
  })

  it('sets descriptions for commands', () => {
    expect(commander.description).toHaveBeenCalledTimes(5)
  })

  it('sets actions for commands', () => {
    expect(commander.action).toHaveBeenCalledTimes(5)
  })
})
