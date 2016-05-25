path = require('path')
expect = require('chai').expect
sinon = require('sinon')
helper = require('../helper')
Settings = require('./../../lib/settings')

describe 'settings', ->
  describe '#get', ->
    mock = helper.mock process, 'argv'
    settings = {}

    beforeEach ->
      process.chdir('./test/assets')

    afterEach ->
      process.chdir('../..')
      mock.restore()

    context 'development env on darwin system', ->
      beforeEach ->
        mock.returns ['--env=development', '--platform=darwin']
        settings = new Settings()

      it 'should return dev config for darwin system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".dmg",
          "system": "darwin",
          "env": "development",
          "devtools": "devtron"
        })

    context 'test env on darwin system', ->
      beforeEach ->
        mock.returns ['--env=test', '--platform=darwin']
        settings = new Settings()

      it 'should return test config for darwin system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".dmg",
          "system": "darwin",
          "env": "test",
          "devtools": "console"
        })

    context 'production env on darwin system', ->
      beforeEach ->
        mock.returns ['--env=production', '--platform=darwin']
        settings = new Settings()

      it 'should return test config for darwin system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".dmg",
          "system": "darwin",
          "env": "production",
          "devtools": "none"
        })

    context 'development env on linux system', ->
      beforeEach ->
        mock.returns ['--env=development', '--platform=linux']
        settings = new Settings()

      it 'should return dev config for linux system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".deb",
          "system": "linux",
          "env": "development",
          "devtools": "devtron"
        })

    context 'test env on linux system', ->
      beforeEach ->
        mock.returns ['--env=test', '--platform=linux']
        settings = new Settings()

      it 'should return test config for linux system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".deb",
          "system": "linux",
          "env": "test",
          "devtools": "console"
        })

    context 'production env on linux system', ->
      beforeEach ->
        mock.returns ['--env=production', '--platform=linux']
        settings = new Settings()

      it 'should return test config for linux system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".deb",
          "system": "linux",
          "env": "production",
          "devtools": "none"
        })

    context 'development env on windows system', ->
      beforeEach ->
        mock.returns ['--env=development', '--platform=windows']
        settings = new Settings()

      it 'should return dev config for windows system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".msi",
          "system": "windows",
          "env": "development",
          "devtools": "devtron"
        })

    context 'test env on windows system', ->
      beforeEach ->
        mock.returns ['--env=test', '--platform=windows']
        settings = new Settings()

      it 'should return test config for windows system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".msi",
          "system": "windows",
          "env": "test",
          "devtools": "console"
        })

    context 'production env on windows system', ->
      beforeEach ->
        mock.returns ['--env=production', '--platform=windows']
        settings = new Settings()

      it 'should return test config for windows system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".msi",
          "system": "windows",
          "env": "production",
          "devtools": "none"
        })
