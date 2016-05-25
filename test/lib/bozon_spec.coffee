expect = require('chai').expect
bozon = require('./../../lib/bozon')
helper = require('../helper')

describe 'bozon', ->

  describe '#settings', ->
    beforeEach ->
      process.chdir('./test/assets')

    afterEach ->
      process.chdir('./../..')

    it 'should read package.json', ->
      expect(bozon.settings()).to.eql({
        "env": "test",
        "name": "TestApp",
        "packaging": {
          "archive": true,
          "overwrite": true,
          "platformResources": {
            "darwin": {
              "icon": "darwin_icon.png"
            },
            "linux": {
              "icon": "linux_icon.png"
            }
          }
        }
      })

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
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/production/darwin/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/production/darwin')

    describe 'production environment and linux platform', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production', '--platform=linux']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/production/linux/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/production/linux')

    describe 'no end and platform specified', ->
      beforeEach ->
        mock.returns ['node', './']

      it 'should return destination path with suffix', ->
        expect(bozon.destinationPath('javascripts')).to.equal(process.cwd() + '/builds/development/javascripts')

      it 'should return destination path without suffix', ->
        expect(bozon.destinationPath()).to.equal(process.cwd() + '/builds/development')

  describe '#releasePath', ->
    mock = helper.mock(process, 'argv')

    afterEach ->
      mock.restore()

    describe 'development env', ->
      beforeEach ->
        mock.returns ['node', './', '--env=development']

      it 'should return release path for develoment env', ->
        expect(bozon.releasePath('development')).to.equal(process.cwd() + '/packages')

    describe 'production env', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production']

      it 'should return release path for production env', ->
        expect(bozon.releasePath()).to.equal(process.cwd() + '/packages')

    describe 'test env', ->
      beforeEach ->
        mock.returns ['node', './', '--env=test']

      it 'should return release path for test env', ->
        expect(bozon.releasePath('test')).to.equal(process.cwd() + '/.tmp')

  describe '#buildPath', ->
    mock = helper.mock(process, 'argv')

    afterEach ->
      mock.restore()

    describe 'production env', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production']

      it 'should return build path', ->
        expect(bozon.buildPath('darwin')).to.equal(process.cwd() + '/builds/production/darwin')

    describe 'staging env', ->
      beforeEach ->
        mock.returns ['node', './', '--env=staging']

      it 'should return staging build path', ->
        expect(bozon.buildPath('linux')).to.equal(process.cwd() + '/builds/staging/linux')

  describe '#packagerPath', ->
    it 'should return path to packager executable', ->
      expect(bozon.packagerPath()).to.equal(process.cwd() + '/node_modules/.bin/electron-packager')

  describe '#packagingEnv', ->
    mock = helper.mock(process, 'argv')

    describe 'Specified environment', ->
      beforeEach ->
        mock.returns ['node', './', '--env=test']

      afterEach ->
        mock.restore()

      it 'should return passed env', ->
        expect(bozon.packagingEnv()).to.eql('test')

    describe 'Unspecified environment', ->
      it 'should return default env', ->
        expect(bozon.packagingEnv()).to.eql('production')

  describe '#testPackagingOptions', ->
    beforeEach ->
      process.chdir('./test/assets')

    afterEach ->
      process.chdir('./../..')

    it 'should return correct packaging options', ->
      expect(bozon.testPackagingOptions()).to.eql([
        './builds/test',
        'TestApp',
        "--platform=#{process.platform}",
        "--arch=#{process.arch}",
        "--out=.tmp",
        "--icon=#{process.platform}_icon.png",
        '--overwrite'
      ])

  describe '#productionPackagingOptions', ->
    beforeEach ->
      process.chdir('./test/assets')

    afterEach ->
      process.chdir('./../..')

    it 'should return correct packaging options', ->
      expect(bozon.productionPackagingOptions('linux', 'x64')).to.eql([
        "#{process.cwd()}/builds/production/linux",
        'TestApp',
        "--platform=linux",
        "--arch=x64",
        "--out=#{process.cwd()}/packages",
        "--icon=linux_icon.png",
        '--overwrite',
        '--asar'
      ])
