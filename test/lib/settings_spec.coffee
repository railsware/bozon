path = require('path')
expect = require('chai').expect
sinon = require('sinon')
Settings = require('./../../lib/settings')

describe 'settings', ->
  describe '#get', ->
    argv = {}
    stub = {}
    settings = {}

    beforeEach ->
      cwd = process.cwd()
      stub = sinon.stub(process, 'cwd')
      stub.returns(path.join(cwd, 'test', 'assets'))

    afterEach ->
      stub.restore()

    context 'development env on darwin system', ->
      beforeEach ->
        argv = process.argv
        process.argv = ['--env=development', '--platform=darwin']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=test', '--platform=darwin']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=production', '--platform=darwin']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=development', '--platform=linux']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=test', '--platform=linux']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=production', '--platform=linux']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=development', '--platform=windows']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=test', '--platform=windows']
        settings = new Settings()

      afterEach ->
        process.argv = argv

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
        argv = process.argv
        process.argv = ['--env=production', '--platform=windows']
        settings = new Settings()

      afterEach ->
        process.argv = argv

      it 'should return test config for windows system', ->
        expect(settings.get()).to.eql({
          "name": "bozon",
          "installer": ".msi",
          "system": "windows",
          "env": "production",
          "devtools": "none"
        })
