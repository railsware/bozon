$ = require('../../helper')
path = require('path')

describe 'Generator', ->
  childProcess = require('child_process')

  Generator = require('./../../../lib/scaffolding/generator')
  generator = {}

  describe '#constructor', ->
    beforeEach ->
      name = 'test-app'
      generator = new Generator(name, {})

    it 'should set defaults for template variables', ->
      date = new Date()
      expect(generator.defaults).to.eql({
        id: "bozonapp",
        bozonVersion: '0.8.3',
        electronBuilderVersion: '20.11.1',
        electronVersion: '2.0.0',
        gulpVersion: '^3.9.1',
        mochaVersion: '^5.1.1',
        spectronVersion: '^3.8.0'
        webpackStreamVersion: '^4.0.3'
        name: 'TestApp',
        author: null,
        year: date.getFullYear()
      })

  describe '#setup', ->
    tmpDir = path.join(process.cwd(), '.tmp')
    installStub = {}

    beforeEach ->
      generator = new Generator('test_app', {})
      installStub = sinon.stub(generator, 'installPackages')
      generator.setup()

    afterEach ->
      childProcess.spawnSync('rm', ['-rf', 'test_app'])
      installStub.restore()

    it 'should create application structure', ->
      expect($.fileExists('.gitignore')).to.be.true
      expect($.fileExists('gulpfile.js')).to.be.true
      expect($.fileExists('webpack.config.js')).to.be.true
      expect($.fileExists('package.json')).to.be.true
      expect($.fileExists('LICENSE')).to.be.true
      expect($.fileExists('README.md')).to.be.true
      expect($.fileExists('app/index.html')).to.be.true
      expect($.fileExists('app/package.json')).to.be.true
      expect($.fileExists('app/javascripts/renderer/application.js')).to.be.true
      expect($.fileExists('app/javascripts/main/index.js')).to.be.true
      expect($.fileExists('app/stylesheets/application.css')).to.be.true
      expect($.fileExists('config/settings.json')).to.be.true
      expect($.fileExists('config/environments/development.json')).to.be.true
      expect($.fileExists('config/environments/test.json')).to.be.true
      expect($.fileExists('config/environments/production.json')).to.be.true
      expect($.fileExists('config/platforms/mac.json')).to.be.true
      expect($.fileExists('config/platforms/linux.json')).to.be.true
      expect($.fileExists('config/platforms/windows.json')).to.be.true
      expect($.fileExists('resources/icon.icns')).to.be.true
      expect($.fileExists('resources/icon.ico')).to.be.true
      expect($.fileExists('spec/helper.js')).to.be.true
      expect($.fileExists('spec/features/main_spec.js')).to.be.true

    it 'should call install packages', ->
      expect(generator.installPackages.calledOnce).to.be.true

    it 'package.json should contain actual information', ->
      expect($.fileContains('package.json', '"name": "TestApp"')).to.be.true
      expect($.fileContains('package.json', '"version": "0.1.0"')).to.be.true
      expect($.fileContains('package.json', '"electron": "2.0.0"')).to.be.true

    it 'app package.json should contain actual information', ->
      expect(
        $.fileContains 'app/package.json', '"name": "TestApp"'
      ).to.be.true
      expect(
        $.fileContains 'app/package.json', '"version": "0.1.0"'
      ).to.be.true
      expect(
        $.fileContains 'app/package.json', '"main": "javascripts/main/index.js"'
      ).to.be.true
