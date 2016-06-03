helper = require('../helper')
path = require('path')
expect = require('chai').expect
sinon = require('sinon')
proxyquire = require('proxyquire')

describe 'Runner', ->
  describe 'new', ->
    beforeEach ->
      @generateSpy = sinon.spy()
      @GeneratorStub = sinon.stub()
      @GeneratorStub::generate = @generateSpy
      runner = proxyquire '../../lib/cli/runner',
        './generator': =>
          generate: @generateSpy
      runner.new()

    it 'should call generate method of Generator', ->
      expect(@generateSpy.calledOnce).to.be.true

  describe 'start', ->
    beforeEach ->
      @runGulpSpy = sinon.spy()
      runner = proxyquire '../../lib/cli/runner',
      '../bozon':
        runGulp: @runGulpSpy
      runner.start()

    it 'should call runGulp with task start', ->
      expect(@runGulpSpy.calledOnce).to.be.true
      expect(@runGulpSpy.getCall(0).args).to.eql([['start']])

  describe 'test', ->
    describe 'no arguments', =>
      beforeEach =>
        @runGulpSpy = sinon.spy()
        @runMochaSpy = sinon.spy()
        @runner = proxyquire '../../lib/cli/runner',
        '../bozon':
          runGulp: @runGulpSpy
          runMocha: @runMochaSpy
        @runner.test()

      it 'should call gulp with task package:test', =>
        expect(@runGulpSpy.calledOnce).to.be.true
        expect(@runGulpSpy.getCall(0).args).to.eql([['package:test']])

      it 'should call mocha --recursive on spec dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec')]])

    describe 'feature test spec', =>
      beforeEach =>
        @runGulpSpy = sinon.spy()
        @runMochaSpy = sinon.spy()
        @runner = proxyquire '../../lib/cli/runner',
        '../bozon':
          runGulp: @runGulpSpy
          runMocha: @runMochaSpy
        @runner.test('spec/features/some_feature_spec.js')

      it 'should call mocha --recursive on exact spec or dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', 'spec/features/some_feature_spec.js']])

      it 'should not call package', =>
        expect(@runGulpSpy.calledOnce).to.be.true
        expect(@runGulpSpy.getCall(0).args).to.eql([['package:test']])

    describe 'unit test spec', =>
      beforeEach =>
        @runGulpSpy = sinon.spy()
        @runMochaSpy = sinon.spy()
        @runner = proxyquire '../../lib/cli/runner',
        '../bozon':
          runGulp: @runGulpSpy
          runMocha: @runMochaSpy
        @runner.test('spec/units/some_spec.js')

      it 'should call mocha --recursive on exact spec or dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', 'spec/units/some_spec.js']])

      it 'should not call package', =>
        expect(@runGulpSpy.calledOnce).to.be.false

  describe 'clear', ->
    beforeEach ->
      @delSpy = sinon.spy()
      runner = proxyquire '../../lib/cli/runner',
      'del': @delSpy
      runner.clear()

    it 'should call del on builds and packages dirs', ->
      expect(@delSpy.calledThrice).to.be.true
      expect(@delSpy.getCall(0).args).to.eql([[process.cwd() + "/builds/**"]])
      expect(@delSpy.getCall(1).args).to.eql([[process.cwd() + "/packages/**"]])
      expect(@delSpy.getCall(2).args).to.eql([[process.cwd() + "/.tmp/**"]])

  describe 'package', ->
    beforeEach ->
      @runGulpSpy = sinon.spy()
      runner = proxyquire '../../lib/cli/runner',
      '../bozon':
        runGulp: @runGulpSpy
      runner.package()

    it 'should call bozon runGulp with task package', ->
      expect(@runGulpSpy.calledOnce).to.be.true
      expect(@runGulpSpy.getCall(0).args).to.eql([['package']])
