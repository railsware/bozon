sinon = require('sinon')
expect = require('chai').expect
helper = require('../helper')
proxyquire = require('proxyquire')

describe 'Packager', =>
  describe '#build', ->
    describe 'test environment', =>
      beforeEach (done) =>
        @packagerSpy = sinon.spy()
        Packager = proxyquire '../../lib/packaging/packager',
          'electron-packager-tf': @packagerSpy
        packager = new Packager()
        packager.build('osx', 'test')
        done()

      it 'should call builder build function', =>
        expect(@packagerSpy.calledOnce).to.be.true

      it 'should pass correct args', =>
        args = @packagerSpy.getCall(0).args[0]
        expect(args).to.eql({
          "name": "TestApp",
          "version": "1.2.1",
          "platform": process.platform,
          "arch": process.arch,
          "dir": "builds/test",
          "out": ".tmp"
        })

    describe 'development environment', =>
      beforeEach (done) =>
        @buildSpy = sinon.spy()
        Packager = proxyquire '../../lib/packaging/packager',
          'electron-builder':
            build: @buildSpy
        packager = new Packager()
        packager.build('linux', 'development')
        done()

      it 'should call builder build function', =>
        expect(@buildSpy.calledOnce).to.be.true

      it 'should pass correct args', =>
        args = @buildSpy.getCall(0).args[0]
        expect(args).to.have.property('devMetadata').and.eql({
          "directories": {
            "app": "builds/development"
            "buildResources": "resources"
            "output": "packages"
          }
        })
        expect(args['targets'].entries().next().value[0].name).to.eql('linux')

    describe 'production environment', =>
      beforeEach =>
        @buildSpy = sinon.spy()
        Packager = proxyquire '../../lib/packaging/packager',
          'electron-builder':
            build: @buildSpy
        packager = new Packager()
        packager.build('windows', 'production')

      it 'should call builder build function', =>
        expect(@buildSpy.calledOnce).to.be.true

      it 'should pass correct args', =>
        args = @buildSpy.getCall(0).args[0]
        expect(args).to.have.property('devMetadata').and.eql({
          "directories": {
            "app": "builds/production"
            "buildResources": "resources"
            "output": "packages"
          }
        })
        expect(args['targets'].entries().next().value[0].name).to.eql('windows')
