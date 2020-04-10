import Packager from 'packager'
import Checker from 'utils/checker'
import { Builder } from 'builder'
import electronBuilder from 'electron-builder'
import { startSpinner, stopSpinner } from 'utils/logger'

jest.unmock('packager')
jest.mock('utils/checker')
jest.mock('utils/logger')

describe('Packager', () => {
  beforeEach(async () => {
    const packager = new Packager('mac', 'production', true)
    await packager.build()
  })

  it('ensures process is run in app directory', () => {
    expect(Checker.ensure).toHaveBeenCalled()
  })

  it('shows spinner', () => {
    expect(startSpinner).toHaveBeenCalledWith('Packaging Electron application')
  })

  it('builds application before packaging', () => {
    expect(Builder.run).toHaveBeenCalledWith('mac', 'production')
  })

  it('packages app with electron builder', () => {
    expect(electronBuilder.build).toHaveBeenCalledWith({
      targets: 'MAC_TARGET',
      config: {
        directories: {
          app: 'builds/production',
          buildResources: 'resources',
          output: 'packages'
        }
      },
      publish: 'always'
    })
  })

  it('stops spinner with success', () => {
    expect(stopSpinner).toHaveBeenCalledWith('Packaging Electron application ✓')
  })
})
