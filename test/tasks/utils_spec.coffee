expect = require('chai').expect
utils = require('./../../tasks/utils/utils')

describe '#argument', ->
  describe 'passed --env and --platform arguments', ->
    argv = {}

    beforeEach ->
      argv = process.argv
      process.argv = ['node', './', '--env=develpment', '--platform=darwin']

    afterEach ->
      process.argv = argv

    it 'should return parsed env argument',  ->
      expect(utils.argument('env')).to.equal('develpment')

    it 'should return parsed platform argument',  ->
      expect(utils.argument('platform')).to.equal('darwin')

  describe 'no arguments passed', ->
    it 'should return null for env argument',  ->
      expect(utils.argument('env')).to.equal(null)

    it 'should return null for platform argument',  ->
      expect(utils.argument('platform')).to.equal(null)

describe '#source', ->

  it 'should return source path with suffix', ->
    expect(utils.source('stylesheets/app.css')).to.equal('app/stylesheets/app.css')

  it 'should return source path without suffix', ->
    expect(utils.source()).to.equal('app')

describe '#destination', ->
  argv = {}
  beforeEach ->
    argv = process.argv

  describe 'test environment', ->
    beforeEach ->
      process.argv = ['node', './', '--env=test', '--platform=darwin']

    afterEach ->
      process.argv = argv

    it 'should return destination path with suffix', ->
      expect(utils.destination('javascripts')).to.equal('builds/test/javascripts')

    it 'should return destination path without suffix', ->
      expect(utils.destination()).to.equal('builds/test')

  describe 'development environment', ->
    beforeEach ->
      process.argv = ['node', './', '--env=development', '--platform=darwin']

    afterEach ->
      process.argv = argv

    it 'should return destination path with suffix', ->
      expect(utils.destination('javascripts')).to.equal('builds/development/javascripts')

    it 'should return destination path without suffix', ->
      expect(utils.destination()).to.equal('builds/development')

  describe 'production environment and darwin platform', ->
    beforeEach ->
      process.argv = ['node', './', '--env=production', '--platform=darwin']

    afterEach ->
      process.argv = argv

    it 'should return destination path with suffix', ->
      expect(utils.destination('javascripts')).to.equal('builds/production/darwin/javascripts')

    it 'should return destination path without suffix', ->
      expect(utils.destination()).to.equal('builds/production/darwin')

  describe 'production environment and linux platform', ->
    beforeEach ->
      process.argv = ['node', './', '--env=production', '--platform=linux']

    afterEach ->
      process.argv = argv

    it 'should return destination path with suffix', ->
      expect(utils.destination('javascripts')).to.equal('builds/production/linux/javascripts')

    it 'should return destination path without suffix', ->
      expect(utils.destination()).to.equal('builds/production/linux')

  describe 'no end and platform specified', ->
    beforeEach ->
      process.argv = ['node', './']

    afterEach ->
      process.argv = argv

    it 'should return destination path with suffix', ->
      expect(utils.destination('javascripts')).to.equal('builds/development/javascripts')

    it 'should return destination path without suffix', ->
      expect(utils.destination()).to.equal('builds/development')

describe '#release', ->
  describe 'development env', ->
    it 'should return release path for develoment env', ->
      expect(utils.release('development')).to.equal('./packages')

  describe 'production env', ->
    it 'should return release path for production env', ->
      expect(utils.release('production')).to.equal('./packages')

  describe 'test env', ->
    it 'should return release path for test env', ->
      expect(utils.release('test')).to.equal('.tmp')



describe '#buildSource', ->
  it 'should return build path', ->
    expect(utils.buildSource('production', 'darwin')).to.equal('builds/production/darwin')

  it 'should return staging build path', ->
    expect(utils.buildSource('staging', 'linux')).to.equal('builds/staging/linux')
