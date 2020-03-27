import Checker from 'utils/checker'
import fs from 'fs'

jest.mock('fs')

describe('Checker', () => {
  beforeEach(() => Checker.ensure())

  it('checks for package.json', () => {
    expect(fs.lstatSync).toHaveBeenCalledWith('/test/home/package.json')
  })

  it('checks for node_modules', () => {
    expect(fs.lstatSync).toHaveBeenCalledWith('/test/home/node_modules')
  })
})
