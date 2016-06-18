helper = require('../../helper')
path = require('path')
reload = require('require-reload')

describe 'SpecRunner', ->
  SpecRunner = {}
  buildSpy = sinon.stub().returns(Promise.resolve(true))
  packagerSpy = sinon.stub().returns
    build: buildSpy
  mochaSpy = sinon.spy()

  describe 'CoffeeScript specs', ->
    utilsSpy = sinon.stub().returns(['js', 'coffee'])

    beforeEach =>
      mockRequire '../../../lib/packaging/packager', packagerSpy
      mockRequire '../../../lib/utils/bozon',
        runMocha: mochaSpy
      mockRequire '../../../lib/testing/utils',
        uniqFileExtensions: utilsSpy
      SpecRunner = require '../../../lib/testing/spec_runner'

    describe 'no arguments', ->
      beforeEach ->
        runner = new SpecRunner()
        runner.run()

      it 'should package test app and run mocha', (done) ->
        expect(packagerSpy.calledOnce).to.eq(true)
        expect(packagerSpy.getCall(0).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.calledOnce).to.eq(true)
        setTimeout ->
          expect(mochaSpy.calledOnce).to.eq(true)
          expect(mochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'coffee:coffee-script/register']])
          done()
        , 0

    describe 'unit spec file', =>
      beforeEach ->
        runner = new SpecRunner('spec/units/some_unit_spec.coffee')
        runner.run()

      it 'should run mocha specs without packaging test app', (done) ->
        expect(packagerSpy.calledOnce).to.eq(true)
        expect(buildSpy.calledOnce).to.eq(true)
        setTimeout ->
          expect(mochaSpy.calledTwice).to.eq(true)
          expect(mochaSpy.getCall(1).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units/some_unit_spec.coffee'), '--compilers', 'coffee:coffee-script/register']])
          done()
        , 0

    describe 'feature spec file', =>
      beforeEach ->
        runner = new SpecRunner('spec/features/some_feature_spec.coffee')
        runner.run()

      it 'should package test app and run mocha specs', (done) ->
        expect(packagerSpy.calledTwice).to.eq(true)
        expect(packagerSpy.getCall(1).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.calledTwice).to.eq(true)
        setTimeout ->
          expect(mochaSpy.calledThrice).to.eq(true)
          expect(mochaSpy.getCall(2).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features/some_feature_spec.coffee'), '--compilers', 'coffee:coffee-script/register']])
          done()
        , 0

  describe 'JavaScript specs', ->
    beforeEach =>
      mockRequire '../../../lib/packaging/packager', packagerSpy
      mockRequire '../../../lib/utils/bozon',
        runMocha: mochaSpy
      mockRequire '../../../lib/testing/utils',
        uniqFileExtensions: sinon.stub().returns(['js'])
      SpecRunner = reload '../../../lib/testing/spec_runner'

    describe 'no arguments', ->
      beforeEach ->
        runner = new SpecRunner()
        runner.run()

      it 'should package test app and run mocha', (done) ->
        expect(packagerSpy.calledThrice).to.eq(true)
        expect(packagerSpy.getCall(2).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.calledThrice).to.eq(true)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(4)
          expect(mochaSpy.getCall(3).args).to.eql([['--recursive', path.join(process.cwd(), 'spec')]])
          done()
        , 0

    describe 'unit spec file', =>
      beforeEach ->
        runner = new SpecRunner('spec/units/some_unit_spec.js')
        runner.run()

      it 'should run mocha specs without packaging test app', (done) ->
        expect(buildSpy.calledThrice).to.eq(true)
        expect(packagerSpy.calledThrice).to.eq(true)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(5)
          expect(mochaSpy.getCall(4).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units/some_unit_spec.js')]])
          done()
        , 0

    describe 'feature spec file', =>
      beforeEach ->
        runner = new SpecRunner('spec/features/some_feature_spec.js')
        runner.run()

      it 'should package test app and run mocha specs', (done) ->
        expect(packagerSpy.callCount).to.eq(4)
        expect(packagerSpy.getCall(3).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.callCount).to.eq(4)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(6)
          expect(mochaSpy.getCall(5).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features/some_feature_spec.js')]])
          done()
        , 0

  describe 'Typescript specs', ->
    beforeEach =>
      mockRequire '../../../lib/packaging/packager', packagerSpy
      mockRequire '../../../lib/utils/bozon',
        runMocha: mochaSpy
      mockRequire '../../../lib/testing/utils',
        uniqFileExtensions: sinon.stub().returns(['ts'])
      SpecRunner = reload '../../../lib/testing/spec_runner'

    describe 'no arguments', ->
      beforeEach ->
        runner = new SpecRunner()
        runner.run()

      it 'should package test app and run mocha', (done) ->
        expect(packagerSpy.callCount).to.eq(5)
        expect(packagerSpy.getCall(4).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.callCount).to.eq(5)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(7)
          expect(mochaSpy.getCall(6).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'ts:typescript-require']])
          done()
        , 0

    describe 'unit spec file', =>
      beforeEach ->
        runner = new SpecRunner('spec/units/some_unit_spec.ts')
        runner.run()

      it 'should run mocha specs without packaging test app', (done) ->
        expect(buildSpy.callCount).to.eq(5)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(8)
          expect(mochaSpy.getCall(7).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units/some_unit_spec.ts'), '--compilers', 'ts:typescript-require']])
          done()
        , 0

    describe 'feature spec file', =>
      beforeEach ->
        runner = new SpecRunner('spec/features/some_feature_spec.js')
        runner.run()

      it 'should package test app and run mocha specs', (done) ->
        expect(packagerSpy.callCount).to.eq(6)
        expect(packagerSpy.getCall(5).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.callCount).to.eq(6)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(9)
          expect(mochaSpy.getCall(8).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features/some_feature_spec.js'), '--compilers', 'ts:typescript-require']])
          done()
        , 0

  describe 'Mixed type specs files', ->
    beforeEach =>
      mockRequire '../../../lib/packaging/packager', packagerSpy
      mockRequire '../../../lib/utils/bozon',
        runMocha: mochaSpy
      mockRequire '../../../lib/testing/utils',
        uniqFileExtensions: sinon.stub().returns(['ts', 'js', 'coffee'])
      SpecRunner = reload '../../../lib/testing/spec_runner'

    describe 'no arguments', ->
      beforeEach ->
        runner = new SpecRunner()
        runner.run()

      it 'should package test app and run mocha', (done) ->
        expect(packagerSpy.callCount).to.eq(7)
        expect(packagerSpy.getCall(6).args).to.eql([helper.platform(), 'test'])
        expect(buildSpy.callCount).to.eq(7)
        setTimeout ->
          expect(mochaSpy.callCount).to.eq(10)
          expect(mochaSpy.getCall(9).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'ts:typescript-require', 'coffee:coffee-script/register']])
          done()
        , 0
