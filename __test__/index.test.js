import commander from 'commander'

import { perform } from 'index'
import { create, start, test, pack, clear } from 'runner'

jest.unmock('index')

describe('bozon cli', () => {
  beforeEach(() => {
    perform()
  })

  describe('version', () => {
    it('sets current version', () => {
      expect(commander.version).toHaveBeenCalledWith('1.2.5')
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

    it('sets create function as action', () => {
      expect(commander.action).toHaveBeenCalledWith(create)
    })
  })

  describe('start', () => {
    it('sets start command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(2, 'start')
    })

    it('add alias', () => {
      expect(commander.alias).toHaveBeenNthCalledWith(1, 's')
    })

    it('adds reload option to start command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(2, '-r, --reload')
    })

    it('adds inspect option to start command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(
        3,
        '-i, --inspect <port>'
      )
    })

    it('adds inspect-brk option to start command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(
        4,
        '-b, --inspect-brk <port>'
      )
    })

    it('sets start function as action', () => {
      expect(commander.action).toHaveBeenCalledWith(start)
    })
  })

  describe('test', () => {
    it('sets test command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(3, 'test [spec]')
    })

    it('sets test function as action', () => {
      expect(commander.action).toHaveBeenCalledWith(test)
    })
  })

  describe('clear', () => {
    it('sets clear command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(4, 'clear')
    })

    it('sets clear function as action', () => {
      expect(commander.action).toHaveBeenCalledWith(clear)
    })
  })

  describe('package', () => {
    it('sets package command', () => {
      expect(commander.command).toHaveBeenNthCalledWith(5, 'package <platform>')
    })

    it('adds publish option to package command', () => {
      expect(commander.option).toHaveBeenNthCalledWith(5, '-p, --publish')
    })

    it('sets pack function as action', () => {
      expect(commander.action).toHaveBeenCalledWith(pack)
    })
  })

  it('sets descriptions for commands', () => {
    expect(commander.description).toHaveBeenCalledTimes(5)
  })

  it('sets actions for commands', () => {
    expect(commander.action).toHaveBeenCalledTimes(5)
  })

  it('it parses process argv', () => {
    expect(commander.parse).toHaveBeenCalledWith(process.argv)
  })
})
