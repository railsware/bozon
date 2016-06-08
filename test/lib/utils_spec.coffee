expect = require('chai').expect
utils = require('./../../lib/utils')
helper = require('../helper')

describe '#argument', ->
  describe 'passed --env and --platform arguments', ->
    mock = helper.mock(process, 'argv')

    beforeEach ->
      mock.returns ['node', './', '--env=develpment', '--platform=darwin']

    afterEach ->
      mock.restore()

    it 'should return parsed env argument',  ->
      expect(utils.argument('env')).to.equal('develpment')

    it 'should return parsed platform argument',  ->
      expect(utils.argument('platform')).to.equal('darwin')

  describe 'no arguments passed', ->
    it 'should return null for env argument',  ->
      expect(utils.argument('env')).to.equal(null)

    it 'should return null for platform argument',  ->
      expect(utils.argument('platform')).to.equal(null)

describe '#extension', =>
  it 'should return file extension', =>
    expect(utils.extension('package.json')).to.eql('json')

  it 'should return file extension', =>
    expect(utils.extension('spec/units/test.js')).to.eql('js')

  it 'should return file extension', =>
    expect(utils.extension('spec/units/test.coffee')).to.eql('coffee')

describe '#isFile', =>
  it 'should detect a file', =>
    expect(utils.isFile('package.json')).to.be.true

  it 'should detect a directory', =>
    expect(utils.isFile('config')).to.be.false

describe '#readFileList', =>
  it 'should return list of files from directory', =>
    expect(utils.readFileList('.')).to.eql([
      'development.json',
      'production.json',
      'test.json',
      'linux.json',
      'osx.json',
      'windows.json',
      'settings.json',
      'package.json',
      "sample.coffee"
      "sample.js",
      "sample.ts",
      "sample.txt",
      "sample1.coffee"
    ])

describe '#uniqFileExtensions', =>
  it 'should return list of uniq file extensions', =>
    expect(utils.uniqFileExtensions('samples')).to.eql(
      ['coffee', 'js', 'ts', 'txt']
    )
