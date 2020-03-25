helper = require('../../helper')

Checker = ensure: sinon.spy()
run = sinon.stub().resolves()
Builder = sinon.mock().returns run: run

electronBuilder =
  build: sinon.stub().resolves()
  Platform:
    MAC:
      createTarget: sinon.mock().returns('MAC')
    LINUX:
      createTarget: sinon.mock().returns('LINUX')

ora = require('../../support/ora_mock')

resetHistory = ->
  ora.resetHistory()
  ora.start.resetHistory()
  ora.succeed.resetHistory()
  Checker.ensure.resetHistory()
  Builder.resetHistory()
  electronBuilder.build.resetHistory()

mock('./../../../src/utils/checker', Checker)
mock('./../../../src/building/builder', Builder)
mock('electron-builder', electronBuilder)
mock('ora', ora)

Packager = require('./../../../src/packaging/packager')

describe 'Packager', ->
  describe '#build', ->
    describe 'production build', ->
      describe 'without publish option', ->
        before ->
          packager = new Packager('mac', 'production')
          packager.build()

        after ->
          resetHistory()
          electronBuilder.Platform.MAC.createTarget.resetHistory()

        it 'call checker to check for electron application', ->
          expect(Checker.ensure.calledOnce).to.be.true

        it 'starts packager spinner', ->
          expect(ora.calledOnce).to.be.true
          expect(ora.getCall(0).args[0]).to.eql {
            text: "\u001b[36mPackaging Electron application\u001b[39m",
            color: 'cyan'
          }

        it 'creates builder with platform and environment', ->
          expect(Builder.calledOnce).to.be.true
          expect(Builder.getCall(0).args).to.eql ['mac', 'production']

        it 'starts spinner', ->
          expect(ora.start.calledOnce).to.be.true

        it 'calls electron-builder build method', ->
          expect(electronBuilder.build.calledOnce).to.be.true
          expect(electronBuilder.build.getCall(0).args[0]).to.eql {
            targets: 'MAC',
            config: {
              directories: {
                app: 'builds/production',
                buildResources: 'resources',
                output: 'packages'
              }
            },
            publish: 'never'
          }

        it 'stops spinner with success', ->
          expect(ora.succeed.calledOnce).to.be.true

      describe 'with publish option', ->
        before ->
          packager = new Packager('mac', 'production', true)
          packager.build()

        after ->
          resetHistory()
          electronBuilder.Platform.MAC.createTarget.resetHistory()

        it 'calls electron-builder build method', ->
          expect(electronBuilder.build.calledOnce).to.be.true
          expect(electronBuilder.build.getCall(0).args[0]).to.eql {
            targets: 'MAC',
            config: {
              directories: {
                app: 'builds/production',
                buildResources: 'resources',
                output: 'packages'
              }
            },
            publish: 'always'
          }

    describe 'test build', ->
      before ->
        packager = new Packager('linux', 'test')
        packager.build()

      after ->
        resetHistory()
        electronBuilder.Platform.LINUX.createTarget.resetHistory()

      it 'call checker to check for electron application', ->
        expect(Checker.ensure.calledOnce).to.be.true

      it 'starts packager spinner', ->
        expect(ora.calledOnce).to.be.true
        expect(ora.getCall(0).args[0]).to.eql {
          text: "\u001b[36mPackaging Electron application\u001b[39m",
          color: 'cyan'
        }

      it 'creates builder with platform and environment', ->
        expect(Builder.calledOnce).to.be.true
        expect(Builder.getCall(0).args).to.eql ['linux', 'test']

      it 'starts spinner', ->
        expect(ora.start.calledOnce).to.be.true

      it 'calls electron-builder build method', ->
        expect(electronBuilder.build.calledOnce).to.be.true
        expect(electronBuilder.build.getCall(0).args[0]).to.eql {
          targets: 'LINUX',
          config: {
            mac: {
              target: ['dir']
            },
            linux: {
              target: ['dir']
            },
            win: {
              target: ['dir']
            },
            directories: {
              app: 'builds/test',
              buildResources: 'resources',
              output: '.tmp'
            }
          }
        }

      it 'stops spinner with success', ->
        expect(ora.succeed.calledOnce).to.be.true

mock.stopAll()
