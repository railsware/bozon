require('../../helper')

describe 'Builder', ->
  copy = sinon.stub().callsArgWith(2, null, null)
  electron = sinon.spy()
  fs = require('../../support/fs_mock')
  ora = require('../../support/ora_mock')
  bozon = require('../../support/bozon_mock')
  webpack = require('../../support/webpack_mock')
  chokidar = require('../../support/chokidar_mock')

  mock('fs', fs)
  mock('ora', ora)
  mock('copy', copy)
  mock('webpack', webpack)
  mock('chokidar', chokidar)
  mock('electron', electron)
  mock('./../../../lib/utils/bozon', bozon)

  Builder = require('./../../../lib/building/builder')

  restoreMocks = ->
    electron.resetHistory()
    copy.resetHistory()
    ora.resetHistory()
    ora.start.resetHistory()
    ora.succeed.resetHistory()
    fs.writeFile.resetHistory()
    fs.existsSync.resetHistory()
    webpack.resetHistory()
    webpack.DefinePlugin.resetHistory()
    chokidar.watch.resetHistory()
    bozon.config.resetHistory()

  describe "#run", ->
    after ->
      mock.stopAll()
      bozon.log.resetHistory()
      ora.resetHistory()

    describe 'development', ->
      before ->
        builder = new Builder('mac', 'development')
        builder.run()

      after ->
        restoreMocks()

      it 'creates builder spinner', ->
        expect(ora.getCall(0).args[0]).to.eql(
          text: '\u001b[36mBuilding Electron application\u001b[39m'
          color: 'cyan'
        )
      it 'starts spinner', ->
        expect(ora.start.calledOnce).to.be.true

      it 'copies html', ->
        copyCall = copy.getCall(0)
        expect(copyCall.args[0]).to.eql "#{process.cwd()}/test/assets/src/renderer/*.html"
        expect(copyCall.args[1]).to.eql "#{process.cwd()}/test/assets/builds/development/renderer"

      it 'copies images', ->
        copyCall = copy.getCall(1)
        expect(copyCall.args[0]).to.eql "#{process.cwd()}/test/assets/src/images/**/*"
        expect(copyCall.args[1]).to.eql "#{process.cwd()}/test/assets/builds/development/images"

      it 'creates json manifest', ->
        expect(fs.writeFile.calledOnce).to.be.true
        expect(fs.writeFile.getCall(0).args[0]).to.eql "#{process.cwd()}/test/assets/builds/development/package.json"
        expect(fs.writeFile.getCall(0).args[1]).to.eql '{"name":"TestApp","author":"Anonymous","main":"main/index.js"}'

      it 'bundles renderer javascript', ->
        expect(webpack.getCall(0).args[0]).to.eql require('../../fixtures/webpack/renderer')('development')

      it 'bundles main process javascript', ->
        expect(webpack.getCall(1).args[0]).to.eql require('../../fixtures/webpack/main')('development')

      it 'stops spinner with success', ->
        expect(ora.succeed.calledOnce).to.be.true

      describe 'watching for changes', ->
        it 'runs watch process', ->
          expect(chokidar.watch.calledOnce).to.be.true
          expect(chokidar.watch.getCall(0).args[0]).to.eql "#{process.cwd()}/test/assets/src/**/*.*"
          expect(chokidar.watch.getCall(0).args[1]).to.eql ignored: /node_modules/, persistent: true

        it 'should subscribe to ready event', ->
          expect(chokidar.on.calledTwice).to.be.true
          expect(chokidar.on.getCall(0).args[0]).to.eql 'ready'

        it 'should stop spiner on ready', ->
          chokidar.on.getCall(0).args[1]()
          expect(ora.stopAndPersist.calledOnce).to.be.true
          expect(ora.stopAndPersist.getCall(0).args[0]).to.eql(
            text: "\u001b[32mWatching for changes..\u001b[39m"
            symbol: "👀"
          )

        it 'should subscribe to change event', ->
          expect(chokidar.on.getCall(1).args[0]).to.eql 'change'

        describe 'file changed in renderer directory', ->
          it 'should trigger renderer compilation on file change', ->
            chokidar.on.getCall(1).args[1]("#{process.cwd()}/test/assets/src/renderer/javascripts/index.js", null)
            expect(bozon.log.getCall(0).args[0]).to.include(
              "[\u001b[32mCHANGE\u001b[39m] File '\u001b[33m../src/renderer/javascripts/index.js\u001b[39m' has been changed"
            )
            expect(bozon.log.getCall(1).args[0]).to.include '[\u001b[90mRENDER\u001b[39m] Compiling..'
            expect(bozon.log.getCall(2).args[0]).to.include '[\u001b[90mRENDER\u001b[39m] \u001b[36mDone\u001b[39m'
            expect(webpack.getCall(2).args[0]).to.eql require('../../fixtures/webpack/renderer')('development')

        describe 'file changed in main directory', ->
          it 'should trigger main compilation on file change', ->
            chokidar.on.getCall(1).args[1]("#{process.cwd()}/test/assets/src/main/index.js", null)
            expect(bozon.log.getCall(3).args[0]).to.include(
              "[\u001b[32mCHANGE\u001b[39m] File '\u001b[33m../src/main/index.js\u001b[39m' has been changed"
            )
            expect(bozon.log.getCall(4).args[0]).to.include '[\u001b[90m~MAIN~\u001b[39m] Compiling..'
            expect(bozon.log.getCall(5).args[0]).to.include '[\u001b[90m~MAIN~\u001b[39m] \u001b[36mDone\u001b[39m'
            expect(webpack.getCall(3).args[0]).to.eql require('../../fixtures/webpack/main')('development')

        describe 'html file changed', ->
          it 'should trigger main compilation on file change', ->
            chokidar.on.getCall(1).args[1]("#{process.cwd()}/test/assets/src/index.html", null)
            expect(bozon.log.getCall(6).args[0]).to.include(
              "[\u001b[32mCHANGE\u001b[39m] File '\u001b[33m../src/index.html\u001b[39m' has been changed"
            )
            expect(bozon.log.getCall(7).args[0]).to.include '[\u001b[90mRENDER\u001b[39m] Updating..'
            expect(bozon.log.getCall(8).args[0]).to.include '[\u001b[90mRENDER\u001b[39m] \u001b[36mDone\u001b[39m'
            expect(copy.getCall(2).args[0]).to.eql "#{process.cwd()}/test/assets/src/*.html"
            expect(copy.getCall(2).args[1]).to.eql "#{process.cwd()}/test/assets/builds/development/"

    describe 'test', ->
      before ->
        builder = new Builder('mac', 'test')
        builder.run()

      after ->
        restoreMocks()

      it 'creates builder spinner', ->
        expect(ora.getCall(0).args[0]).to.eql(
          text: '\u001b[36mBuilding Electron application\u001b[39m'
          color: 'cyan'
        )
      it 'starts spinner', ->
        expect(ora.start.calledOnce).to.be.true

      it 'copies html', ->
        copyCall = copy.getCall(0)
        expect(copyCall.args[0]).to.eql "#{process.cwd()}/test/assets/src/renderer/*.html"
        expect(copyCall.args[1]).to.eql "#{process.cwd()}/test/assets/builds/test/renderer"

      it 'copies images', ->
        copyCall = copy.getCall(1)
        expect(copyCall.args[0]).to.eql "#{process.cwd()}/test/assets/src/images/**/*"
        expect(copyCall.args[1]).to.eql "#{process.cwd()}/test/assets/builds/test/images"

      it 'creates json manifest', ->
        expect(fs.writeFile.calledOnce).to.be.true
        expect(fs.writeFile.getCall(0).args[0]).to.eql "#{process.cwd()}/test/assets/builds/test/package.json"
        expect(fs.writeFile.getCall(0).args[1]).to.eql '{"name":"TestApp","author":"Anonymous","main":"main/index.js"}'

      it 'bundles renderer javascript', ->
        expect(webpack.getCall(0).args[0]).to.eql require('../../fixtures/webpack/renderer')('test')

      it 'bundles main process javascript', ->
        expect(webpack.getCall(1).args[0]).to.eql require('../../fixtures/webpack/main')('test')

      it 'stops spinner with success', ->
        expect(ora.succeed.calledOnce).to.be.true

      it 'should not run watch process', ->
        expect(chokidar.watch.calledOnce).to.be.false

    describe 'production', ->
      before ->
        builder = new Builder('mac', 'production')
        builder.run()

      after ->
        restoreMocks()

      it 'creates builder spinner', ->
        expect(ora.getCall(0).args[0]).to.eql(
          text: '\u001b[36mBuilding Electron application\u001b[39m'
          color: 'cyan'
        )
      it 'starts spinner', ->
        expect(ora.start.calledOnce).to.be.true

      it 'copies html', ->
        copyCall = copy.getCall(0)
        expect(copyCall.args[0]).to.eql "#{process.cwd()}/test/assets/src/renderer/*.html"
        expect(copyCall.args[1]).to.eql "#{process.cwd()}/test/assets/builds/production/renderer"

      it 'copies images', ->
        copyCall = copy.getCall(1)
        expect(copyCall.args[0]).to.eql "#{process.cwd()}/test/assets/src/images/**/*"
        expect(copyCall.args[1]).to.eql "#{process.cwd()}/test/assets/builds/production/images"

      it 'creates json manifest', ->
        expect(fs.writeFile.calledOnce).to.be.true
        expect(fs.writeFile.getCall(0).args[0]).to.eql "#{process.cwd()}/test/assets/builds/production/package.json"
        expect(fs.writeFile.getCall(0).args[1]).to.eql '{"name":"TestApp","author":"Anonymous","main":"main/index.js"}'

      it 'bundles renderer javascript', ->
        expect(webpack.getCall(0).args[0]).to.eql require('../../fixtures/webpack/renderer')('production')

      it 'bundles main process javascript', ->
        expect(webpack.getCall(1).args[0]).to.eql require('../../fixtures/webpack/main')('production')

      it 'stops spinner with success', ->
        expect(ora.succeed.calledOnce).to.be.true

      it 'should not run watch process', ->
        expect(chokidar.watch.calledOnce).to.be.false

mock.stopAll()
