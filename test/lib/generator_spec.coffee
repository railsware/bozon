$ = require('../helper')

childProcess = require('child_process')
path = require('path')
expect = require('chai').expect
sinon = require('sinon')

Generator = require('./../../lib/cli/generator')

describe 'Generator', ->
  generator = {}

  describe '#constructor', ->
    beforeEach ->
      name = 'test-app'
      generator = new Generator(name, {})

    it 'should set defaults for template variables', ->
      date = new Date()
      expect(generator.defaults).to.eql({
        bozonVersion: "0.3.4",
        electronVersion: "1.1.1",
        name: 'TestApp',
        platforms: ['linux-x64', 'darwin-x64', 'win32-ia32'],
        platformsStr: "[\"linux-x64\", \"darwin-x64\", \"win32-ia32\"]",
        year: date.getFullYear()
      })

  describe '#setup', ->
    tmpDir = path.join(process.cwd(), '.tmp')
    stub = {}

    before ->
      childProcess.spawnSync('mkdir', [tmpDir])
      process.chdir('.tmp')
      generator = new Generator('test_app', {})
      stub = sinon.stub(generator, 'installPackages')
      generator.setup()

    after ->
      process.chdir('..')
      childProcess.spawnSync('rm', ['-rf', tmpDir])
      stub.restore()

    it 'should create application structure', ->
      expect($.fileExists('.gitignore')).to.be.true
      expect($.fileExists('gulpfile.js')).to.be.true
      expect($.fileExists('package.json')).to.be.true
      expect($.fileExists('LICENSE')).to.be.true
      expect($.fileExists('README.md')).to.be.true
      expect($.fileExists('app/index.html')).to.be.true
      expect($.fileExists('app/package.json')).to.be.true
      expect($.fileExists('app/javascripts/renderer/application.js')).to.be.true
      expect($.fileExists('app/javascripts/main/index.js')).to.be.true
      expect($.fileExists('app/stylesheets/application.css')).to.be.true
      expect($.fileExists('app/images/electron.icns')).to.be.true
      expect($.fileExists('app/images/electron.ico')).to.be.true
      expect($.fileExists('app/images/electron.png')).to.be.true
      expect($.fileExists('config/settings.json')).to.be.true
      expect($.fileExists('config/environments/development.json')).to.be.true
      expect($.fileExists('config/environments/test.json')).to.be.true
      expect($.fileExists('config/environments/production.json')).to.be.true
      expect($.fileExists('config/platforms/darwin.json')).to.be.true
      expect($.fileExists('config/platforms/linux.json')).to.be.true
      expect($.fileExists('config/platforms/win32.json')).to.be.true
      expect($.fileExists('spec/helper.js')).to.be.true
      expect($.fileExists('spec/main_spec.js')).to.be.true

    it 'should call install packages', ->
      expect(generator.installPackages).to.be.calledOnce

    it 'package.json should contain actual information', ->
      expect($.fileContains('package.json', '"name": "TestApp"')).to.be.true
      expect($.fileContains('package.json', '"version": "0.1.0"')).to.be.true
      expect($.fileContains('package.json', '"electron-prebuilt": "1.1.1"')).to.be.true
      expect($.fileContains('package.json', '"version": "1.1.1"')).to.be.true
      expect($.fileContains('package.json', '"platforms": ["linux-x64", "darwin-x64", "win32-ia32"]')).to.be.true

    it 'app package.json should contain actual information', ->
      expect($.fileContains('app/package.json', '"name": "TestApp"')).to.be.true
      expect($.fileContains('app/package.json', '"version": "0.1.0"')).to.be.true
      expect($.fileContains('app/package.json', '"main": "javascripts/main/index.js"')).to.be.true
