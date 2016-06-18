path = require('path')
fs = require('fs')
global.expect = require('chai').expect
global.sinon = require('sinon')
global.mockRequire = require('mock-require')

beforeEach ->
  process.chdir('./test/assets')

afterEach ->
  process.chdir('./../..')
  mockRequire.stopAll()

class Mock
  constructor: (@object, @property) ->
    @[@property] = @object[@property]

  returns: (value) =>
    @object[@property] = value

  restore: =>
    @object[@property] = @[@property]

module.exports =
  mock: (object, property) ->
    new Mock(object, property)

  platform: ->
    if process.platform is 'darwin'
      'osx'
    else
      process.platform

  fileExists: (file) ->
    filePath = path.join(process.cwd(), 'test_app', file)
    try
      fs.statSync(filePath)
      true
    catch error
      console.error("  no such file or directory #{error.path}")
      false

  fileContains: (file, string) ->
    filePath = path.join(process.cwd(), 'test_app', file)
    contents = fs.readFileSync(filePath, 'utf8')
    regexp = new RegExp(string, 'g')
    contents.match(regexp) isnt null
