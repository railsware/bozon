import { Builder } from 'builder'

import fs from 'fs'
import webpack from 'webpack'
import { copy } from 'fs-extra'
import { startSpinner, stopSpinner } from 'utils/logger'

jest.mock('fs')
jest.unmock('builder')
jest.mock('builder/webpack_config')
jest.mock('utils/logger')

describe('Builder', () => {
  beforeEach(async () => {
    fs.__setFileList(['index.html'])
    await Builder.run('mac', 'production')
  })

  it('logs build start', () => {
    expect(startSpinner).toHaveBeenCalledWith('Building Electron application')
  })

  it('copies html files', () => {
    expect(copy).toHaveBeenCalledWith(
      '/test/home/src/renderer/index.html',
      '/test/home/builds/production/renderer/index.html',
      expect.any(Function)
    )
  })

  it('bundles all scripts', () => {
    expect(webpack).toHaveBeenNthCalledWith(
      1,
      { target: 'electron-renderer' },
      expect.any(Function)
    )
    expect(webpack).toHaveBeenNthCalledWith(
      2,
      { target: 'electron-main' },
      expect.any(Function)
    )
    expect(webpack).toHaveBeenNthCalledWith(
      3,
      { target: 'electron-preload' },
      expect.any(Function)
    )
  })

  it('writes package.json file', () => {
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/test/home/builds/production/package.json',
      '{"author":"Anonymous","main":"main/index.js"}',
      expect.any(Function)
    )
  })

  it('logs success message', () => {
    expect(stopSpinner).toHaveBeenCalledWith(
      'Building Electron application'
    )
  })
})
