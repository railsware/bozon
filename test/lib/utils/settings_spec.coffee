helper = require('../../helper')

describe 'Settings', ->
  Settings = require('./../../../lib/utils/settings')
  describe '#get', ->
    mock = helper.mock process, 'argv'
    settings = {}

    afterEach ->
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

  describe '#argument', ->
    mock = helper.mock(process, 'argv')
    settings = {}

    describe 'passed --env development and --platform darwin arguments', ->
      beforeEach ->
        mock.returns ['node', './', '--env=development', '--platform=darwin']
        settings = new Settings()

      afterEach ->
        mock.restore()

      it 'should return parsed env argument', ->
        expect(settings.argument('env')).to.equal('development')

      it 'should return parsed platform argument', ->
        expect(settings.argument('platform')).to.equal('darwin')

    describe 'passed --env production and --platform linux arguments', ->
      beforeEach ->
        mock.returns ['node', './', '--env=production', '--platform=linux']
        settings = new Settings()

      afterEach ->
        mock.restore()

      it 'should return parsed env argument', ->
        expect(settings.argument('env')).to.equal('production')

      it 'should return parsed platform argument', ->
        expect(settings.argument('platform')).to.equal('linux')

    describe 'no arguments passed', ->
      beforeEach ->
        settings = new Settings()

      it 'should return null for env argument', ->
        expect(settings.argument('env')).to.equal(null)

      it 'should return null for platform argument', ->
        expect(settings.argument('platform')).to.equal(null)
