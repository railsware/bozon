helper = require('../../helper')

describe 'Packager', ->
  Packager = {}
  packager = {}

  describe '#build', ->
    electronBuilderBuildSpy = sinon.stub().returns(Promise.resolve(true))
    electronBuilderSpy =
      build: electronBuilderBuildSpy
      Platform:
        'MAC':
          createTarget: -> 'mac'
        'LINUX':
          createTarget: -> 'linux'
        'WINDOWS':
          createTarget: -> 'windows'
    checkerSpy =
      ensure: -> true
    builderRunSpy = sinon.stub().returns(Promise.resolve(true))
    builderSpy = sinon.spy ->
      run: builderRunSpy

    beforeEach ->
      mockRequire '../../../lib/utils/checker', checkerSpy
      mockRequire '../../../lib/building/builder', builderSpy
      mockRequire '../../../lib/utils/bozon',
        requireLocal: (name) -> electronBuilderSpy

      Packager = require('../../../lib/packaging/packager')

    describe 'test environment', ->
      beforeEach ->
        packager = new Packager('mac', 'test')

      it 'should run builder', ->
        packager.build().then ->
          expect(builderSpy.calledOnce).to.eq(true)
          expect(builderSpy.getCall(0).args).to.eql(['mac', 'test'])
          expect(builderRunSpy.calledOnce).to.eq(true)

      it 'should run builder', ->
        packager.build().then ->
          expect(electronBuilderBuildSpy.callCount).to.eq(2)
          expect(electronBuilderBuildSpy.getCall(1).args[0]).to.eql({
            "targets": "mac",
            "config": {
              "directories": {
                "app": "builds/test"
                "buildResources": "resources"
                "output": ".tmp"
              },
              "linux": {
                "target": ["dir"]
              },
              "mac": {
                "target": ["dir"]
              },
              "win": {
                "target": ["dir"]
              }
            }
          })

    describe 'development environment', ->
      beforeEach ->
        packager = new Packager('linux', 'development')

      it 'should run builder', ->
        packager.build().then ->
          expect(builderSpy.callCount).to.eq(3)
          expect(builderSpy.getCall(2).args).to.eql(['linux', 'development'])
          expect(builderRunSpy.callCount).to.eq(3)

      it 'should run electron builder', ->
        packager.build().then ->
          expect(electronBuilderBuildSpy.callCount).to.eq(4)
          expect(electronBuilderBuildSpy.getCall(3).args[0]).to.eql({
            "targets": "linux",
            "config": {
              "directories": {
                "app": "builds/development"
                "buildResources": "resources"
                "output": "packages"
              }
            }
          })

    describe 'production environment', ->
      beforeEach ->
        packager = new Packager('windows', 'production')

      it 'should run builder', ->
        packager.build().then ->
          expect(builderSpy.callCount).to.eq(5)
          expect(builderSpy.getCall(4).args).to.eql(['windows', 'production'])
          expect(builderRunSpy.callCount).to.eq(5)

      it 'should run electron builder', ->
        packager.build().then ->
          expect(electronBuilderBuildSpy.callCount).to.eq(6)
          expect(electronBuilderBuildSpy.getCall(5).args[0]).to.eql({
            "targets": "windows",
            "config": {
              "directories": {
                "app": "builds/production"
                "buildResources": "resources"
                "output": "packages"
              }
            }
          })
