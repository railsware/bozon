bozon = {}
expect = require('chai').expect
helper = require('../helper')

describe 'bozon', =>
  beforeEach =>
    process.chdir('./test/assets')
    bozon = require('./../../lib/bozon')

  afterEach =>
    process.chdir('./../..')

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
