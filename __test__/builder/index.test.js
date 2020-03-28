import Builder from 'builder'

import fs from 'fs'
import ora from 'ora'
import webpack from 'webpack'
import { copy } from 'fs-extra'

jest.mock('fs')
jest.unmock('builder')
jest.mock('builder/webpack_config')

describe('Builder', () => {
  beforeEach(async () => {
    fs.__setFileList(['index.html'])
    const builder = new Builder('mac', 'production')
    await builder.run()
  })

  it('creates spinner', () => {
    expect(ora).toHaveBeenCalledWith({
      color: 'cyan',
      text: 'Building Electron application'
    })
  })

  it('starts spinner', () => {
    expect(ora.start).toHaveBeenCalled()
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

  it('stops spinner with success message', () => {
    expect(ora.succeed).toHaveBeenCalledWith(
      'Building Electron application: Done'
    )
  })
})
