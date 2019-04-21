helper = require('../../helper')

configFile = sinon.spy()
configGet = sinon.spy()

Config = sinon.mock().returns
  file: configFile
  get: configGet

childProcess =
  spawn: sinon.spy()
  spawnSync: sinon.spy()

mock('child_process', childProcess)
mock('merge-config', Config)

resetChildProcessHistory = ->
  childProcess.spawn.resetHistory()
  childProcess.spawnSync.resetHistory()

resetConfigHistory = ->
  Config.resetHistory()
  configFile.resetHistory()
  configGet.resetHistory()

bozon = require('./../../../lib/utils/bozon')

describe '#bozon', ->
  describe '#srcDir', ->
    it 'returns src', ->
      expect(bozon.srcDir).to.eq 'src'

  describe '#source', ->
    describe 'with arguments', ->
      it 'returns path within source path', ->
        result = bozon.source('config', 'envs', 'test.js')
        expect(result).to.eq("#{process.cwd()}/config/envs/test.js")

    describe 'without arguments', ->
      it 'returns current working directory', ->
        expect(bozon.source()).to.eq(process.cwd())

  describe '#config', ->
    describe 'development env on mac platform', ->
      before ->
        bozon.config('development', 'mac')

      after ->
        resetConfigHistory()

      it 'concats proper configuration', ->
        expect(Config.calledOnce).to.be.true
        expect(configFile.callCount).to.eql 3
        expect(configGet.calledOnce).to.be.true
        expect(configFile.getCall(0).args).to.eql ["#{process.cwd()}/config/settings.json"]
        expect(configFile.getCall(1).args).to.eql ["#{process.cwd()}/config/environments/development.json"]
        expect(configFile.getCall(2).args).to.eql ["#{process.cwd()}/config/platforms/mac.json"]

    describe 'test env on linux platform', ->
      before ->
        bozon.config('test', 'linux')

      after ->
        resetConfigHistory()

      it 'concats proper configuration', ->
        expect(Config.calledOnce).to.be.true
        expect(configFile.callCount).to.eql 3
        expect(configGet.calledOnce).to.be.true
        expect(configFile.getCall(0).args).to.eql ["#{process.cwd()}/config/settings.json"]
        expect(configFile.getCall(1).args).to.eql ["#{process.cwd()}/config/environments/test.json"]
        expect(configFile.getCall(2).args).to.eql ["#{process.cwd()}/config/platforms/linux.json"]

    describe 'production env on windows platform', ->
      before ->
        bozon.config('production', 'windows')

      after ->
        resetConfigHistory()

      it 'concats proper configuration', ->
        expect(Config.calledOnce).to.be.true
        expect(configFile.callCount).to.eql 3
        expect(configGet.calledOnce).to.be.true
        expect(configFile.getCall(0).args).to.eql ["#{process.cwd()}/config/settings.json"]
        expect(configFile.getCall(1).args).to.eql ["#{process.cwd()}/config/environments/production.json"]
        expect(configFile.getCall(2).args).to.eql ["#{process.cwd()}/config/platforms/windows.json"]

  describe '#platform', ->
    stub = (platform) ->
      sandbox = sinon.createSandbox()
      sandbox.stub(process, 'platform').value(platform)

    describe 'windows platform', ->
      it 'returns platform name', ->
        stub('windows')
        expect(bozon.platform()).to.eql('windows')

      it 'returns platform name', ->
        stub('win32')
        expect(bozon.platform()).to.eql('windows')

    describe 'mac os platform', ->
      it 'returns platform name', ->
        stub('mac')
        expect(bozon.platform()).to.eql('mac')

      it 'returns platform name', ->
        stub('darwin')
        expect(bozon.platform()).to.eql('mac')

    describe 'linux platform', ->
      it 'returns platform name', ->
        stub('linux')
        expect(bozon.platform()).to.eql('linux')

    describe 'undefined platform', ->
      it 'returns platform name', ->
        stub('centos')
        expect((-> bozon.platform())).to.throw('Unsupported platform centos')

  describe '#binary', ->
    it 'returns path to binary file', ->
      result = bozon.binary('webpack')
      expect(result).to.eq("#{process.cwd()}/node_modules/.bin/webpack")

  describe '#runMocha', ->
    describe 'empty params', ->
      before ->
        bozon.runMocha()

      after ->
        resetChildProcessHistory()

      it 'runs electron with development build', ->
        expect(childProcess.spawnSync.getCall(0).args).to.eql [
          "#{process.cwd()}/node_modules/.bin/mocha",
          undefined,
          {shell: true, stdio: 'inherit'}
        ]
    describe 'params present', ->
      before ->
        bozon.runMocha(['test/unit/index'])

      after ->
        resetChildProcessHistory()

      it 'runs electron with development build', ->
        expect(childProcess.spawnSync.getCall(0).args).to.eql [
          "#{process.cwd()}/node_modules/.bin/mocha",
          ["test/unit/index"],
          {shell: true, stdio: 'inherit'}
        ]

  describe '#runElectron', ->
    describe 'empty params', ->
      before ->
        bozon.runElectron()

      after ->
        resetChildProcessHistory()

      it 'runs electron with development build', ->
        expect(childProcess.spawn.getCall(0).args).to.eql [
          "#{process.cwd()}/node_modules/.bin/electron",
          ["#{process.cwd()}/builds/development"],
          {shell: true, stdio: 'inherit'}
        ]
    describe 'params present', ->
      before ->
        bozon.runElectron(['--debug'])

      after ->
        resetChildProcessHistory()

      it 'runs electron with development build', ->
        expect(childProcess.spawn.getCall(0).args).to.eql [
          "#{process.cwd()}/node_modules/.bin/electron",
          ["--debug", "#{process.cwd()}/builds/development"],
          {shell: true, stdio: 'inherit'}
        ]

  describe '#spawnSync', ->
    before ->
      bozon.spawnSync 'npm', ['install', '-g', 'bozon']

    after ->
      resetChildProcessHistory()

    it 'passes command and options to childProcess', ->
      expect(childProcess.spawnSync.getCall(0).args).to.eql [
        'npm',
        ['install', '-g', 'bozon'],
        {shell: true, stdio: 'inherit'}
      ]

  describe '#spawn', ->
    before ->
      bozon.spawn 'npm', ['install', '-g', 'bozon']

    after ->
      resetChildProcessHistory()

    it 'passes command and options to childProcess', ->
      expect(childProcess.spawn.getCall(0).args).to.eql [
        'npm',
        ['install', '-g', 'bozon'],
        {shell: true, stdio: 'inherit'}
      ]

  describe '#sourcePath', ->
    describe 'with arguments', ->
      it 'returns path within source path', ->
        result = bozon.sourcePath('main/components/index.js')
        expect(result).to.eq("#{process.cwd()}/src/main/components/index.js")

    describe 'without arguments', ->
      it 'returns path to src directory', ->
        expect(bozon.sourcePath()).to.eq("#{process.cwd()}/src")

  describe '#destinationPath', ->
    describe 'test environment', ->
      it 'returns build destination path', ->
        result = bozon.destinationPath('index.html', 'test')
        expect(result).to.eq("#{process.cwd()}/builds/test/index.html")

    describe 'development environment', ->
      it 'returns build destination path', ->
        result = bozon.destinationPath('index.html', 'development')
        expect(result).to.eq("#{process.cwd()}/builds/development/index.html")

    describe 'production environment', ->
      it 'returns build destination path', ->
        result = bozon.destinationPath('index.html', 'production')
        expect(result).to.eq("#{process.cwd()}/builds/production/index.html")

mock.stopAll()
