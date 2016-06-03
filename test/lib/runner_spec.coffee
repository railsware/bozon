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
      @runGulpSpy = sinon.spy()
      @spawnSyncSpy = sinon.spy()
      runner = proxyquire '../../lib/runner',
      './bozon':
        runGulp: @runGulpSpy
        spawnSync: @spawnSyncSpy
      runner.start()

    it 'should call runGulp with task start', =>
      expect(@runGulpSpy.calledOnce).to.be.true
      expect(@runGulpSpy.getCall(0).args).to.eql([['compile', '--env=development', '--platform=' + process.platform]])

  describe 'test', =>
    describe 'no arguments', =>
      beforeEach =>
        process.chdir('./test/assets')
        @runGulpSpy = sinon.spy()
        @runMochaSpy = sinon.spy()
        @spawnSyncSpy = sinon.spy()
        @runner = proxyquire '../../lib/runner',
        './bozon':
          runGulp: @runGulpSpy
          runMocha: @runMochaSpy
          spawnSync: @spawnSyncSpy
        @runner.test()

      afterEach =>
        process.chdir('./../..')

      it 'should compile application', =>
        expect(@runGulpSpy.calledOnce).to.be.true
        expect(@runGulpSpy.getCall(0).args).to.eql([['compile', '--env=test', "--platform=#{process.platform}"]])

      it 'should package application', =>
        expect(@spawnSyncSpy.calledOnce).to.be.true
        expect(@spawnSyncSpy.getCall(0).args).to.eql([
          "#{process.cwd()}/node_modules/.bin/electron-packager",
          [ "./builds/test",
            'TestApp',
            "--platform=#{process.platform}",
            "--arch=#{process.arch}",
            '--out=.tmp',
            "--icon=#{process.platform}_icon.png",
            '--overwrite'
          ]
        ])

      it 'should call mocha --recursive on spec dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec')]])

    describe 'feature test spec', =>
      beforeEach =>
        process.chdir('./test/assets')
        @runGulpSpy = sinon.spy()
        @runMochaSpy = sinon.spy()
        @spawnSyncSpy = sinon.spy()
        @runner = proxyquire '../../lib/runner',
        './bozon':
          runGulp: @runGulpSpy
          runMocha: @runMochaSpy
          spawnSync: @spawnSyncSpy
        @runner.test('spec/features/some_feature_spec.js')

      afterEach =>
        process.chdir('./../..')

      it 'should compile application', =>
        expect(@runGulpSpy.calledOnce).to.be.true
        expect(@runGulpSpy.getCall(0).args).to.eql([['compile', '--env=test', "--platform=#{process.platform}"]])

      it 'should package application', =>
        expect(@spawnSyncSpy.calledOnce).to.be.true
        expect(@spawnSyncSpy.getCall(0).args).to.eql([
          "#{process.cwd()}/node_modules/.bin/electron-packager",
          [ "./builds/test",
            'TestApp',
            "--platform=#{process.platform}",
            "--arch=#{process.arch}",
            '--out=.tmp',
            "--icon=#{process.platform}_icon.png",
            '--overwrite'
          ]
        ])

      it 'should call mocha --recursive on exact spec or dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', 'spec/features/some_feature_spec.js']])

    describe 'unit test spec', =>
      beforeEach =>
        process.chdir('./test/assets')
        @runGulpSpy = sinon.spy()
        @runMochaSpy = sinon.spy()
        @spawnSyncSpy = sinon.spy()
        @runner = proxyquire '../../lib/runner',
        './bozon':
          runGulp: @runGulpSpy
          runMocha: @runMochaSpy
          spawnSync: @spawnSyncSpy
        @runner.test('spec/units/some_spec.js')

      afterEach =>
        process.chdir('./../..')

      it 'should call mocha --recursive on exact spec or dir', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', 'spec/units/some_spec.js']])

      it 'should not compile app', =>
        expect(@runGulpSpy.calledOnce).to.be.false

      it 'should not package package', =>
        expect(@spawnSyncSpy.calledOnce).to.be.false

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
    beforeEach =>
      process.chdir('./test/assets')
      @runGulpSpy = sinon.spy()
      @spawnSyncSpy = sinon.spy()
      runner = proxyquire '../../lib/runner',
      './bozon':
        runGulp: @runGulpSpy
        spawnSync: @spawnSyncSpy
      runner.package()

    afterEach =>
      process.chdir('./../..')

    it 'should call bozon runGulp with task package', =>
      expect(@runGulpSpy.calledTwice).to.be.true
      expect(@runGulpSpy.getCall(0).args).to.eql([['compile', '--env=production', '--platform=darwin']])
      expect(@runGulpSpy.getCall(1).args).to.eql([['compile', '--env=production', '--platform=linux']])
