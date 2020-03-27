import Packager from 'packager'
import ora from 'ora'
import Checker from 'utils/checker'
import Builder from 'builder'
import electronBuilder from 'electron-builder'

jest.unmock('packager')
jest.mock('utils/checker')

describe('Packager', () => {
  beforeEach(async () => {
    const packager = new Packager('mac', 'production', true)
    await packager.build()
  })

  it('ensures process is run in app directory', () => {
    expect(Checker.ensure).toHaveBeenCalled()
  })

  it('shows spinner', () => {
    expect(ora).toHaveBeenCalledWith({
      color: 'cyan',
      text: 'Packaging Electron application'
    })
    expect(ora.start).toHaveBeenCalled()
  })

  it('builds application before packaging', () => {
    expect(Builder).toHaveBeenCalledWith('mac', 'production')
    expect(Builder.run).toHaveBeenCalledWith()
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
    expect(ora.succeed).toHaveBeenCalled()
  })
})
