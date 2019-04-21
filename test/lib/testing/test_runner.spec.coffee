helper = require('../../helper')

Checker = ensure: sinon.spy()
build = sinon.mock().resolves()
Packager = sinon.mock().returns(build: build)
start = sinon.spy()
succeed = sinon.spy()
fail = sinon.spy()
ora = sinon.mock().returns start: start, succeed: succeed, fail: fail

bozon = require('../../support/bozon_mock')
utils = require('../../support/test_utils_mock')

mock('ora', ora)
mock('../../../lib/utils/bozon', bozon)
mock('../../../lib/utils/checker', Checker)
mock('../../../lib/packaging/packager', Packager)
mock('../../../lib/testing/utils', utils)

TestRunner = require '../../../lib/testing/test_runner'

resetHistory = ->
  Checker.ensure.resetHistory()
  succeed.resetHistory()
  ora.resetHistory()
  bozon.runMocha.resetHistory()
  utils.uniqFileExtensions.resetHistory()

describe 'Test Runner', ->
  describe '#run', ->

    describe 'without feature tests', ->
      before ->
        runner = new TestRunner(path: 'test')
        runner.run()

      after ->
        resetHistory()

      it 'should check if current dir is electron app root', ->
        expect(Checker.ensure.calledOnce).to.be.true

      it 'should create spinner', ->
        expect(ora.calledOnce).to.be.true
        expect(ora.getCall(0).args[0]).to.eql {
          text: '\u001b[36mRunning test suite\u001b[39m',
          color: 'cyan'
        }

      it 'should not invoke Packager', ->
        expect(Packager.called).to.be.false

      it 'should run mocha with options', ->
        expect(bozon.runMocha.calledOnce).to.be.true
        expect(bozon.runMocha.getCall(0).args[0]).to.eql [
          "--recursive"
          "test"
          "--timeout"
          2000
          "--exit"
        ]

    describe 'with feature tests', ->
      before ->
        runner = new TestRunner(path: 'test/features')
        runner.run()

      after ->
        resetHistory()
        Packager.resetHistory()
        build.resetHistory()

      it 'should check if current dir is electron app root', ->
        expect(Checker.ensure.calledOnce).to.be.true

      it 'should create spinner', ->
        expect(ora.calledOnce).to.be.true
        expect(ora.getCall(0).args[0]).to.eql {
          text: '\u001b[36mRunning test suite\u001b[39m',
          color: 'cyan'
        }

      it 'should invoke Packager', ->
        expect(Packager.calledOnce).to.be.true
        expect(Packager.getCall(0).args).to.eql(['mac', 'test'])
        expect(build.calledOnce).to.be.true

      it 'should run mocha with options', ->
        expect(bozon.runMocha.getCall(0).args[0]).to.eql [
          "--recursive"
          "test/features"
          "--timeout"
          2000
          "--exit"
        ]

mock.stopAll()
