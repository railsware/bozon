helper = require('../../helper')
childProcess = require('child_process')
bozon = require('./../../support/bozon_mock')

mock('../../../lib/utils/bozon', bozon)

Generator = require('./../../../lib/scaffolding/generator')

describe 'Generator', ->
  generator = new Generator('test_app', {})
  installStub = sinon.stub(generator, 'installPackages')

  before ->
    process.chdir('./test/assets')
    generator.setup()

  after ->
    installStub.restore()
    childProcess.spawnSync('rm', ['-rf', 'test_app'])
    process.chdir('./../..')

  describe '#setup', ->
    it 'should create application structure', ->
      expect(helper.fileExists('.gitignore')).to.be.true
      expect(helper.fileExists('webpack.config.js')).to.be.true
      expect(helper.fileExists('package.json')).to.be.true
      expect(helper.fileExists('LICENSE')).to.be.true
      expect(helper.fileExists('README.md')).to.be.true
      expect(helper.fileExists('src/renderer/index.html')).to.be.true
      expect(helper.fileExists('src/renderer/javascripts/index.js')).to.be.true
      expect(helper.fileExists('src/renderer/stylesheets/application.css')).to.be.true
      expect(helper.fileExists('src/main/index.js')).to.be.true
      expect(helper.fileExists('src/preload/index.js')).to.be.true
      expect(helper.fileExists('config/settings.json')).to.be.true
      expect(helper.fileExists('config/environments/development.json')).to.be.true
      expect(helper.fileExists('config/environments/test.json')).to.be.true
      expect(helper.fileExists('config/environments/production.json')).to.be.true
      expect(helper.fileExists('config/platforms/mac.json')).to.be.true
      expect(helper.fileExists('config/platforms/linux.json')).to.be.true
      expect(helper.fileExists('config/platforms/windows.json')).to.be.true
      expect(helper.fileExists('resources/icon.icns')).to.be.true
      expect(helper.fileExists('resources/icon.ico')).to.be.true
      expect(helper.fileExists('test/helper.js')).to.be.true
      expect(helper.fileExists('test/features/main_spec.js')).to.be.true

    it 'should call install packages', ->
      expect(generator.installPackages.calledOnce).to.be.true

    it 'package.json should contain actual information', ->
      expect(helper.fileContains('package.json', '"name": "TestApp"')).to.be.true
      expect(helper.fileContains('package.json', '"version": "0.1.0"')).to.be.true
      expect(helper.fileContains('package.json', '"bozon": "0.10.3')).to.be.true

    it 'logs generator steps', ->
      expect(bozon.log.getCall(0).args[0]).to.eq '  \u001b[32mcreate\u001b[39m .gitignore'
      expect(bozon.log.getCall(1).args[0]).to.eq '  \u001b[32mcreate\u001b[39m package.json'
      expect(bozon.log.getCall(2).args[0]).to.eq '  \u001b[32mcreate\u001b[39m webpack.config.js'
      expect(bozon.log.getCall(3).args[0]).to.eq '  \u001b[32mcreate\u001b[39m LICENSE'
      expect(bozon.log.getCall(4).args[0]).to.eq '  \u001b[32mcreate\u001b[39m README.md'
      expect(bozon.log.getCall(5).args[0]).to.eq '  \u001b[32mcreate\u001b[39m src/main/index.js'
      expect(bozon.log.getCall(6).args[0]).to.eq '  \u001b[32mcreate\u001b[39m src/preload/index.js'
      expect(bozon.log.getCall(7).args[0]).to.eq '  \u001b[32mcreate\u001b[39m src/renderer/index.html'
      expect(bozon.log.getCall(8).args[0]).to.eq '  \u001b[32mcreate\u001b[39m src/renderer/stylesheets/application.css'
      expect(bozon.log.getCall(9).args[0]).to.eq '  \u001b[32mcreate\u001b[39m src/renderer/javascripts/index.js'
      expect(bozon.log.getCall(10).args[0]).to.eq '  \u001b[32mcreate\u001b[39m resources/icon.icns'
      expect(bozon.log.getCall(11).args[0]).to.eq '  \u001b[32mcreate\u001b[39m resources/icon.ico'
      expect(bozon.log.getCall(12).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/settings.json'
      expect(bozon.log.getCall(13).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/environments/development.json'
      expect(bozon.log.getCall(14).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/environments/production.json'
      expect(bozon.log.getCall(15).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/environments/test.json'
      expect(bozon.log.getCall(16).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/platforms/windows.json'
      expect(bozon.log.getCall(17).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/platforms/linux.json'
      expect(bozon.log.getCall(18).args[0]).to.eq '  \u001b[32mcreate\u001b[39m config/platforms/mac.json'
      expect(bozon.log.getCall(19).args[0]).to.eq '  \u001b[32mcreate\u001b[39m test/features/main_spec.js'
      expect(bozon.log.getCall(20).args[0]).to.eq '  \u001b[32mcreate\u001b[39m test/helper.js'
      expect(bozon.log.getCall(22).args[0]).to.eq "Success! Created test_app at #{process.cwd()}/test_app"

mock.stopAll()
