require('../../helper')

describe 'Builder', ->
  Builder = {}
  gulpSpy = sinon.spy()

  beforeEach =>
    mockRequire '../../../lib/utils/bozon', runGulp: gulpSpy
    Builder = require('../../../lib/building/builder')

  describe 'compile for osx with development env', =>
    beforeEach =>
      builder = new Builder('osx', 'development')
      builder.run()

    it 'should run gulp prepare:app command', ->
      expect(gulpSpy.calledOnce).to.be.true
      expect(gulpSpy.getCall(0).args[0]).to.eql([
        'prepare:app',
        '--platform=osx',
        '--env=development'
      ])

  describe 'compile for linux with test env', =>
    beforeEach =>
      builder = new Builder('linux', 'test')
      builder.run()

    it 'should run gulp prepare:app command', =>
      expect(gulpSpy.calledTwice).to.be.true
      expect(gulpSpy.getCall(1).args[0]).to.eql([
        'prepare:app',
        '--platform=linux',
        '--env=test'
      ])

  describe 'compile for linux with test env', =>
    beforeEach =>
      builder = new Builder('windows', 'production')
      builder.run()

    it 'should run gulp prepare:app command', =>
      expect(gulpSpy.calledThrice).to.be.true
      expect(gulpSpy.getCall(2).args[0]).to.eql([
        'prepare:app',
        '--platform=windows',
        '--env=production'
      ])
