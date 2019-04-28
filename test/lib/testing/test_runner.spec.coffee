helper = require('../../helper')

Checker = ensure: sinon.spy()
build = sinon.mock().resolves()
Packager = sinon.mock().returns(build: build)

ora = require('../../support/ora_mock')
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
  ora.succeed.resetHistory()
  ora.resetHistory()
  bozon.runMocha.resetHistory()
  utils.uniqFileExtensions.resetHistory()

describe 'Test Runner', ->
  describe '#run', ->

    describe 'without feature tests', ->
      before ->
        runner = new TestRunner(path: 'test/unit')
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
          "test/unit"
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

    describe 'app packaging', ->
      afterEach ->
        resetHistory()
        Packager.resetHistory()
        build.resetHistory()

      describe 'spec path equals `test`', ->
        before ->
          new TestRunner(path: 'test').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `test/`', ->
        before ->
          new TestRunner(path: 'test/').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `./test`', ->
        before ->
          new TestRunner(path: './test').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `./test/features`', ->
        before ->
          new TestRunner(path: './test/features').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `./test/unit`', ->
        before ->
          new TestRunner(path: './test/unit').run()

        it 'should not package app', ->
          expect(Packager.calledOnce).not.to.be.true
          expect(build.calledOnce).not.to.be.true

      describe 'spec path equals `spec`', ->
        before ->
          new TestRunner(path: 'spec').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `spec/`', ->
        before ->
          new TestRunner(path: 'spec/').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `./spec`', ->
        before ->
          new TestRunner(path: './spec').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `./spec/features`', ->
        before ->
          new TestRunner(path: './spec/features').run()

        it 'should package app', ->
          expect(Packager.calledOnce).to.be.true
          expect(build.calledOnce).to.be.true

      describe 'spec path equals `./spec/unit`', ->
        before ->
          new TestRunner(path: './spec/unit').run()

        it 'should not package app', ->
          expect(Packager.calledOnce).not.to.be.true
          expect(build.calledOnce).not.to.be.true

    describe 'with coffee files', ->
      before ->
        utils.uniqFileExtensions = sinon.mock().returns(['js', 'coffee'])
        runner = new TestRunner(path: 'test/features')
        runner.run()

      after ->
        resetHistory()
        Packager.resetHistory()
        build.resetHistory()

      it 'should run mocha with options', ->
        expect(bozon.runMocha.getCall(0).args[0]).to.eql [
          "--recursive"
          "test/features"
          "--require"
          "coffeescript/register"
          "--extension"
          "coffee"
          "--timeout"
          2000
          "--exit"
        ]

    describe 'with typescript files', ->
      before ->
        utils.uniqFileExtensions = sinon.mock().returns(['js', 'ts'])
        runner = new TestRunner(path: 'test/features')
        runner.run()

      after ->
        resetHistory()
        Packager.resetHistory()
        build.resetHistory()

      it 'should run mocha with options', ->
        expect(bozon.runMocha.getCall(0).args[0]).to.eql [
          "--recursive"
          "test/features"
          "--require"
          "ts-node/register"
          "--extension"
          "ts"
          "--timeout"
          2000
          "--exit"
        ]


mock.stopAll()
