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
