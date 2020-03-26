import bozon from 'utils/bozon'

jest.spyOn(console, 'log').mockImplementation()

describe('utils', () => {
  describe('source', () => {
    it('returns file path in src directory', () => {
      expect(bozon.source('package.json')).toBe('/test/home/package.json')
    })
  })

  describe('platform', () => {
    it('returns current platform', () => {
      expect(bozon.platform()).toBe('linux')
    })
  })

  describe('binary', () => {
    it('returns path to binary file', () => {
      expect(bozon.binary('mocha')).toBe('/test/home/node_modules/.bin/mocha')
    })
  })

  describe('sourcePath', () => {
    it('returns source path to file', () => {
      expect(bozon.sourcePath('index.js')).toBe('/test/home/src/index.js')
    })
  })

  describe('destinationPath', () => {
    it('returns path to destination file', () => {
      expect(bozon.destinationPath('index.js', 'development')).toBe(
        '/test/home/builds/development/index.js'
      )
    })
  })

  describe('log', () => {
    bozon.log('message')
    expect(console.log).toHaveBeenCalledWith('message')
  })
})
