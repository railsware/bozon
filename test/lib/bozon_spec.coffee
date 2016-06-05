bozon = {}
sinon = require('sinon')
expect = require('chai').expect
proxyquire = require('proxyquire')
helper = require('../helper')

describe '#bozon', =>
  beforeEach =>
    bozon = require('./../../lib/bozon')

  describe '#task', ->
    beforeEach =>
      @gulpSpy = sinon.spy()
      bozon = proxyquire './../../lib/bozon',
        gulp:
          task: @gulpSpy
      bozon.task('compile')

    it 'should set gulp task', =>
      expect(@gulpSpy.calledOnce).to.be.true
      expect(@gulpSpy.getCall(0).args[0]).to.eq('compile')

  describe '#src', ->
    beforeEach =>
      @gulpSpy = sinon.spy()
      bozon = proxyquire './../../lib/bozon',
        gulp:
          src: @gulpSpy
      bozon.src('javascripts')

    it 'should set gulp src', =>
      expect(@gulpSpy.calledOnce).to.be.true
      expect(@gulpSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/app/javascripts")

  describe '#dest', ->
    beforeEach =>
      @gulpSpy = sinon.spy()
      bozon = proxyquire './../../lib/bozon',
        gulp:
          dest: @gulpSpy
      bozon.dest('javascripts')

    it 'should set gulp dest', =>
      expect(@gulpSpy.calledOnce).to.be.true
      expect(@gulpSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/builds/development/javascripts")

  describe '#runGulp', =>
    beforeEach =>
      @childProcessSpy = sinon.spy()
      bozon = proxyquire './../../lib/bozon',
        'child_process':
          spawnSync: @childProcessSpy
      bozon.runGulp(['compile', '--env=development'])

    it 'should run gulp with arguments', =>
      expect(@childProcessSpy.calledOnce).to.be.true
      expect(@childProcessSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/node_modules/.bin/gulp")
      expect(@childProcessSpy.getCall(0).args[1]).to.eql(['compile', '--env=development'])

  describe '#runMocha', =>
    beforeEach =>
      @childProcessSpy = sinon.spy()
      bozon = proxyquire './../../lib/bozon',
        'child_process':
          spawnSync: @childProcessSpy
      bozon.runMocha(['--recursive', 'spec/unit/some_spec.js'])

    it 'should run mocha with arguments', =>
      expect(@childProcessSpy.calledOnce).to.be.true
      expect(@childProcessSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/node_modules/.bin/mocha")
      expect(@childProcessSpy.getCall(0).args[1]).to.eql(['--recursive', 'spec/unit/some_spec.js'])

  describe '#runElectron', =>
    beforeEach =>
      @childProcessSpy = sinon.spy()
      bozon = proxyquire './../../lib/bozon',
        'child_process':
          spawnSync: @childProcessSpy
      bozon.runElectron()

    it 'should run electron for build directory', =>
      expect(@childProcessSpy.calledOnce).to.be.true
      expect(@childProcessSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/node_modules/.bin/electron")
      expect(@childProcessSpy.getCall(0).args[1]).to.eql(["#{process.cwd()}/builds/development"])

  describe '#compile', =>
    describe 'compile for oxs with development env', =>
      beforeEach =>
        @childProcessSpy = sinon.spy()
        bozon = proxyquire './../../lib/bozon',
          'child_process':
            spawnSync: @childProcessSpy
        bozon.compile('osx', 'development')

      it 'should run gulp compile command', =>
        expect(@childProcessSpy.calledOnce).to.be.true
        expect(@childProcessSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/node_modules/.bin/gulp")
        expect(@childProcessSpy.getCall(0).args[1]).to.eql(['compile', '--env=development', '--platform=osx'])

    describe 'compile for linux with test env', =>
      beforeEach =>
        @childProcessSpy = sinon.spy()
        bozon = proxyquire './../../lib/bozon',
          'child_process':
            spawnSync: @childProcessSpy
        bozon.compile('linux', 'test')

      it 'should run gulp compile command', =>
        expect(@childProcessSpy.calledOnce).to.be.true
        expect(@childProcessSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/node_modules/.bin/gulp")
        expect(@childProcessSpy.getCall(0).args[1]).to.eql(['compile', '--env=test', '--platform=linux'])

    describe 'compile for linux with test env', =>
      beforeEach =>
        @childProcessSpy = sinon.spy()
        bozon = proxyquire './../../lib/bozon',
          'child_process':
            spawnSync: @childProcessSpy
        bozon.compile('windows', 'production')

      it 'should run gulp compile command', =>
        expect(@childProcessSpy.calledOnce).to.be.true
        expect(@childProcessSpy.getCall(0).args[0]).to.eq("#{process.cwd()}/node_modules/.bin/gulp")
        expect(@childProcessSpy.getCall(0).args[1]).to.eql(['compile', '--env=production', '--platform=windows'])

  describe '#package', =>
    describe 'production on windows', =>
      beforeEach =>
        @childProcessSpy = sinon.spy()
        @packagerSpy = sinon.spy()
        bozon = proxyquire './../../lib/bozon',
          './packager': =>
            build: @packagerSpy
          'child_process':
            spawnSync: @childProcessSpy
        bozon.package('windows', 'production')

      it 'should call packager build method', =>
        expect(@packagerSpy.calledOnce).to.be.true
        expect(@packagerSpy.getCall(0).args).to.eql(['windows', 'production'])

    describe 'development on osx', =>
      beforeEach =>
        @childProcessSpy = sinon.spy()
        @packagerSpy = sinon.spy()
        bozon = proxyquire './../../lib/bozon',
          './packager': =>
            build: @packagerSpy
          'child_process':
            spawnSync: @childProcessSpy
        bozon.package('osx', 'development')

      it 'should call packager build method', =>
        expect(@packagerSpy.calledOnce).to.be.true
        expect(@packagerSpy.getCall(0).args).to.eql(['osx', 'development'])

    describe 'test on linux', =>
      beforeEach =>
        @childProcessSpy = sinon.spy()
        @packagerSpy = sinon.spy()
        bozon = proxyquire './../../lib/bozon',
          './packager': =>
            build: @packagerSpy
          'child_process':
            spawnSync: @childProcessSpy
        bozon.package('linux', 'test')

      it 'should call packager build method', =>
        expect(@packagerSpy.calledOnce).to.be.true
        expect(@packagerSpy.getCall(0).args).to.eql(['linux', 'test'])

  describe '#sourcePath', ->
    it 'should return source path with suffix', ->
      expect(bozon.sourcePath('stylesheets/app.css')).to.equal(process.cwd() + '/app/stylesheets/app.css')

    it 'should return source path without suffix', ->
      expect(bozon.sourcePath()).to.equal(process.cwd() + '/app')

  describe '#destinationPath', ->
    mock = helper.mock(process, 'argv')

    afterEach ->
      mock.restore()

    describe 'test environment', ->
      beforeEach ->
        mock.returns ['node', './', '--env=test', '--platform=darwin']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/test/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/test')

    describe 'development environment', ->
      beforeEach ->
        mock.returns ['node', './', '--env=development', '--platform=darwin']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/development/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/development')

    describe 'production environment and darwin platform', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production', '--platform=darwin']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/production/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/production')

    describe 'production environment and linux platform', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production', '--platform=linux']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/production/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/production')

    describe 'no end and platform specified', ->
      beforeEach ->
        mock.returns ['node', './']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/development/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/development')

  describe '#specPath', =>
    it 'should return specs path', =>
      expect(bozon.specPath()).to.eq("#{process.cwd()}/spec")
