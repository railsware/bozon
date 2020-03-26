import { platform, source, sourcePath, destinationPath } from 'utils/bozon'

jest.spyOn(console, 'log').mockImplementation()

describe('utils', () => {
  describe('source', () => {
    it('returns file path in src directory', () => {
      expect(source('package.json')).toBe('/test/home/package.json')
    })
  })

  describe('platform', () => {
    it('returns current platform', () => {
      expect(platform()).toBe('linux')
    })
  })

  describe('sourcePath', () => {
    it('returns source path to file', () => {
      expect(sourcePath('index.js')).toBe('/test/home/src/index.js')
    })
  })

  describe('destinationPath', () => {
    it('returns path to destination file', () => {
      expect(destinationPath('index.js', 'development')).toBe(
        '/test/home/builds/development/index.js'
      )
    })
  })
})
