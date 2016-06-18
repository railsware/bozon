helper = require('../../helper')

describe 'Runner', =>

  runner = {}
  generateSpy = sinon.spy()
  starterSpy  = sinon.spy()
  specRunnerSpy = sinon.spy()
  cleanerSpy = sinon.spy()
  packagerSpy = sinon.spy()
  generatorMock = sinon.mock().returns(generate: generateSpy)
  specRunnerMock = sinon.mock().returns(run: specRunnerSpy)
  packagerMock = sinon.mock().returns(build: packagerSpy)

  beforeEach =>
    mockRequire '../../../lib/scaffolding/generator', generatorMock
    mockRequire '../../../lib/testing/spec_runner', specRunnerMock
    mockRequire '../../../lib/packaging/packager', packagerMock
    mockRequire '../../../lib/clearing/cleaner', => run: cleanerSpy
    mockRequire '../../../lib/starting/starter', => run: starterSpy

    runner = require '../../../lib/bin/runner'

  describe 'new', =>
    beforeEach =>
      runner.new('test_app')

    it 'should create instance of Generator with app name', =>
      expect(generatorMock.calledOnce).to.be.true
      expect(generatorMock.getCall(0).args[0]).to.eq('test_app')
      expect(generateSpy.calledOnce).to.be.true

  describe 'start', =>
    beforeEach =>
      runner.start()

    it 'should compile app and run electron app', =>
      expect(starterSpy.calledOnce).to.be.true

  describe 'test', =>
    beforeEach =>
      runner.test('spec/units/')

    it 'should create instance of SpecRunner', =>
      expect(specRunnerMock.calledOnce).to.be.true
      expect(specRunnerMock.getCall(0).args[0]).to.eq('spec/units/')
      expect(specRunnerSpy.calledOnce).to.be.true

  describe 'clear', =>
    beforeEach =>
      runner.clear()

    it 'should call del on builds and packages dirs', =>
      expect(cleanerSpy.calledOnce).to.be.true

  describe 'package', =>
    beforeEach =>
      runner.package('osx')

    it 'should call create instance of Packager', =>
      expect(packagerMock.calledOnce).to.be.true
      expect(packagerMock.getCall(0).args[0]).to.eq('osx')
      expect(packagerSpy.calledOnce).to.be.true
