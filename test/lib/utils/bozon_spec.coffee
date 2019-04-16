helper = require('../../helper')

describe '#bozon', ->
  bozon = {}
  childProcessSpy = sinon.spy()
  gulpTaskSpy = sinon.spy()
  gulpSrcSpy = sinon.spy()
  gulpDestSpy = sinon.spy()

  beforeEach ->
    mockRequire 'child_process', spawnSync: childProcessSpy, spawn: childProcessSpy
    mockRequire 'gulp', src: gulpSrcSpy, dest: gulpDestSpy
    bozon = require('./../../../lib/bozon')

  afterEach ->
    mockRequire.stop 'child_process'
    mockRequire.stop 'gulp'

  describe '#src', ->
    afterEach ->
      gulpSrcSpy.resetHistory()

    it 'should set gulp src', ->
      bozon.src('javascripts')
      expect(gulpSrcSpy.calledOnce).to.be.true
      expect(gulpSrcSpy.getCall(0).args[0]).to.eq(
        "#{process.cwd()}/app/javascripts"
      )

    it 'should set multiple gulp sources', ->
      bozon.src(['javascripts', 'styles'])
      expect(gulpSrcSpy.calledOnce).to.be.true
      expect(gulpSrcSpy.getCall(0).args[0]).to.instanceof(Array)
      expect(gulpSrcSpy.getCall(0).args[0][0]).to
        .eq("#{process.cwd()}/app/javascripts")
      expect(gulpSrcSpy.getCall(0).args[0][1]).to
        .eq("#{process.cwd()}/app/styles")

  describe '#dest', ->
    beforeEach ->
      bozon.dest('javascripts')

    it 'should set gulp dest', ->
      expect(gulpDestSpy.calledOnce).to.be.true
      expect(gulpDestSpy.getCall(0).args[0]).to
        .eq("#{process.cwd()}/builds/development/javascripts")

  describe '#runGulp', ->
    beforeEach -> bozon.runGulp(['compile', '--env=development'])

    it 'should run gulp with arguments', ->
      expect(childProcessSpy.calledOnce).to.be.true
      expect(childProcessSpy.getCall(0).args[0]).to
        .eq("#{process.cwd()}/node_modules/.bin/gulp")
      expect(childProcessSpy.getCall(0).args[1]).to
        .eql(['compile', '--env=development'])

  describe '#runMocha', ->
    beforeEach -> bozon.runMocha(['--recursive', 'spec/unit/some_spec.js'])

    it 'should run mocha with arguments', ->
      expect(childProcessSpy.calledTwice).to.be.true
      expect(childProcessSpy.getCall(1).args[0]).to
        .eq("#{process.cwd()}/node_modules/.bin/mocha")
      expect(childProcessSpy.getCall(1).args[1]).to
        .eql(['--recursive', 'spec/unit/some_spec.js'])

  describe '#runElectron', ->
    beforeEach -> bozon.runElectron()

    it 'should run electron for build directory', ->
      expect(childProcessSpy.calledThrice).to.be.true
      expect(childProcessSpy.getCall(2).args[0]).to
        .eq("#{process.cwd()}/node_modules/.bin/electron")
      expect(childProcessSpy.getCall(2).args[1]).to
        .eql(["#{process.cwd()}/builds/development"])

  describe '#sourcePath', ->
    it 'should return source path with suffix', ->
      expect(bozon.sourcePath('stylesheets/app.css')).to
        .equal(process.cwd() + '/app/stylesheets/app.css')

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
        expect(bozon.destinationPath('javascripts')).to
          .equal(process.cwd() + '/builds/test/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/test')

    describe 'development environment', ->
      beforeEach ->
        mock.returns ['node', './', '--env=development', '--platform=darwin']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to
          .equal(process.cwd() + '/builds/development/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to
          .equal(process.cwd() + '/builds/development')

    describe 'production environment and darwin platform', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production', '--platform=darwin']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to
          .equal(process.cwd() + '/builds/production/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to
          .equal(process.cwd() + '/builds/production')

    describe 'production environment and linux platform', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production', '--platform=linux']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to
          .equal(process.cwd() + '/builds/production/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to
          .equal(process.cwd() + '/builds/production')

    describe 'no end and platform specified', ->
      beforeEach ->
        mock.returns ['node', './']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to
          .equal(process.cwd() + '/builds/development/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to
          .equal(process.cwd() + '/builds/development')
