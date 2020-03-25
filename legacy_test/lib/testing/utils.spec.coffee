helper = require('../../helper')

utils = require('./../../../src/testing/utils')

describe 'Testing utils', ->
  before ->
    process.chdir('./test/assets')

  after ->
    process.chdir('./../..')

  describe '#extension', =>
    it 'should return json extension', =>
      expect(utils.extension('package.json')).to.eql('json')

    it 'should return js extension', =>
      expect(utils.extension('spec/units/test.js')).to.eql('js')

    it 'should return coffee extension', =>
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
        'mac.json',
        'windows.json',
        'settings.json',
        'package.json',
        "sample.coffee"
        "sample.js",
        "sample.ts",
        "sample.txt",
        "sample1.coffee",
        "webpack.config.js"
      ])

  describe '#uniqFileExtensions', =>
    it 'should return list of uniq file extensions', =>
      expect(utils.uniqFileExtensions('samples')).to.eql(
        ['coffee', 'js', 'ts', 'txt']
      )

mock.stopAll()
