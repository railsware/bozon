import { config, platform, source, sourcePath, destinationPath } from 'utils'

import Config from 'merge-config'

jest.spyOn(console, 'log').mockImplementation()
jest.mock('child_process')
jest.unmock('utils')

describe('utils', () => {
  describe('config', () => {
    it('builds config for mac and production', () => {
      config('production', 'mac')
      expect(Config).toHaveBeenCalled()
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/settings.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/environments/production.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/platforms/mac.json')
    })

    it('builds config for mac and test', () => {
      config('test', 'mac')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/settings.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/environments/test.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/platforms/mac.json')
    })

    it('builds config for linux and production', () => {
      config('production', 'linux')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/settings.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/environments/production.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/platforms/linux.json')
    })

    it('builds config for windows and test', () => {
      config('production', 'linux')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/settings.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/environments/production.json')
      expect(Config.file).toHaveBeenCalledWith('/test/home/config/platforms/linux.json')
    })
  })

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
