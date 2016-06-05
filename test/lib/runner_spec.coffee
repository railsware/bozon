helper = require('../helper')
path = require('path')
expect = require('chai').expect
sinon = require('sinon')
proxyquire = require('proxyquire')

describe 'Runner', =>
  describe 'new', =>
    beforeEach =>
      @generateSpy = sinon.spy()
      @GeneratorStub = sinon.stub()
      @GeneratorStub::generate = @generateSpy
      runner = proxyquire '../../lib/runner',
        './generator': =>
          generate: @generateSpy
      runner.new()

    it 'should call generate method of Generator', =>
      expect(@generateSpy.calledOnce).to.be.true

  describe 'start', =>
    beforeEach =>
      @compileSpy = sinon.spy()
      @runElectronSpy = sinon.spy()
      runner = proxyquire '../../lib/runner',
      './bozon':
        compile: @compileSpy
        runElectron: @runElectronSpy
      runner.start()

    it 'should compile app and run electron app', =>
      expect(@compileSpy.withArgs(helper.platform(), 'development').calledOnce).to.be.true
      expect(@runElectronSpy.calledOnce).to.be.true

  describe 'test', =>
    describe 'no arguments', =>
      beforeEach =>
        @compileSpy = sinon.spy()
        @packageSpy = sinon.stub().returns Promise.resolve(true)
        @runMochaSpy = sinon.spy()
        @runner = proxyquire '../../lib/runner',
        './bozon':
          compile: @compileSpy
          package: @packageSpy
          runMocha: @runMochaSpy
        @runner.test()

      it 'should compile application', =>
        expect(@compileSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should package application', =>
        expect(@packageSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should call mocha --recursive on spec dir', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec')]])

    describe 'feature test spec', =>
      beforeEach =>
        @compileSpy = sinon.spy()
        @packageSpy = sinon.stub().returns Promise.resolve(true)
        @runMochaSpy = sinon.spy()
        @runner = proxyquire '../../lib/runner',
        './bozon':
          compile: @compileSpy
          package: @packageSpy
          runMocha: @runMochaSpy
        @runner.test('spec/features/some_feature_spec.js')

      it 'should compile application', =>
        expect(@compileSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should package application', =>
        expect(@packageSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should call mocha --recursive on spec dir', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', 'spec/features/some_feature_spec.js']])

    describe 'unit test spec', =>
      beforeEach =>
        @compileSpy = sinon.spy()
        @packageSpy = sinon.stub().returns Promise.resolve(true)
        @runMochaSpy = sinon.spy()
        @runner = proxyquire '../../lib/runner',
        './bozon':
          compile: @compileSpy
          package: @packageSpy
          runMocha: @runMochaSpy
        @runner.test('spec/units/some_spec.js')

      it 'should call mocha --recursive on exact spec or dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', 'spec/units/some_spec.js']])

      it 'should not compile app', =>
        expect(@compileSpy.calledOnce).to.be.false

      it 'should not package package', =>
        expect(@packageSpy.calledOnce).to.be.false

  describe 'clear', =>
    beforeEach =>
      @delSpy = sinon.spy()
      runner = proxyquire '../../lib/runner',
      'del': @delSpy
      runner.clear()

    it 'should call del on builds and packages dirs', =>
      expect(@delSpy.calledThrice).to.be.true
      expect(@delSpy.getCall(0).args).to.eql([[process.cwd() + '/builds/**']])
      expect(@delSpy.getCall(1).args).to.eql([[process.cwd() + '/packages/**']])
      expect(@delSpy.getCall(2).args).to.eql([[process.cwd() + '/.tmp/**']])

  describe 'package', =>
    describe 'windows platform', =>
      beforeEach =>
        @runGulpSpy = sinon.spy()
        @packageSpy = sinon.spy()
        runner = proxyquire '../../lib/runner',
        './bozon':
          compile: @compileSpy
          package: @packageSpy
        runner.package('windows')

      it 'should compile and package application', =>
        expect(@compileSpy.withArgs('windows', 'production').calledOnce).to.be.true
        expect(@packageSpy.withArgs('windows', 'production').calledOnce).to.be.true

    describe 'linux platform', =>
      beforeEach =>
        @runGulpSpy = sinon.spy()
        @packageSpy = sinon.spy()
        runner = proxyquire '../../lib/runner',
        './bozon':
          compile: @compileSpy
          package: @packageSpy
        runner.package('linux')

      it 'should compile and package application', =>
        expect(@compileSpy.withArgs('linux', 'production').calledOnce).to.be.true
        expect(@packageSpy.withArgs('linux', 'production').calledOnce).to.be.true

    describe 'mac os platform', =>
      beforeEach =>
        @runGulpSpy = sinon.spy()
        @packageSpy = sinon.spy()
        runner = proxyquire '../../lib/runner',
        './bozon':
          compile: @compileSpy
          package: @packageSpy
        runner.package('osx')

      it 'should compile and package application', =>
        expect(@compileSpy.withArgs('osx', 'production').calledOnce).to.be.true
        expect(@packageSpy.withArgs('osx', 'production').calledOnce).to.be.true
