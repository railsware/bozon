helper = require('../helper')
path = require('path')
expect = require('chai').expect
sinon = require('sinon')
proxyquire = require('proxyquire')

SpecRunner = {}
@utilsMock = {}

describe '#run', =>
  beforeEach =>
    @compileSpy = sinon.spy()
    @packageSpy = sinon.stub().returns Promise.resolve(true)
    @runMochaSpy = sinon.spy()
    SpecRunner = proxyquire '../../lib/testing/spec_runner',
      './../bozon':
        compile: @compileSpy
        package: @packageSpy
        runMocha: @runMochaSpy
      './../utils':  @utilsMock

  describe 'no arguments', =>
    describe 'javascript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js']
        @runner = new SpecRunner()
        @runner.run()

      it 'should compile application', =>
        expect(@compileSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should package application', =>
        expect(@packageSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should call mocha --recursive on spec dir', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec')]])

    describe 'coffeescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js', 'coffee']
        @runner = new SpecRunner()
        @runner.run()

      it 'should pass coffee as compilers option', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'coffee:coffee-script/register']])

    describe 'typescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['ts']
        @runner = new SpecRunner()
        @runner.run()

      it 'should pass typescript as compilers option', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'ts:typescript-require']])

    describe 'javascript, coffeescript and typescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js', 'ts', 'coffee', 'json', 'hamlbars']
        @runner = new SpecRunner()
        @runner.run()

      it 'should pass typescript and coffeescript as compilers option', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'ts:typescript-require', 'coffee:coffee-script/register']])

    describe 'other formats', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['coffee', 'json', 'hamlbars']
        @runner = new SpecRunner()
        @runner.run()

      it 'should not pass json and hamlbars as compilers option', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec'), '--compilers', 'coffee:coffee-script/register']])

  describe 'feature spec file', =>
    describe 'javascript file', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js']
        @runner = new SpecRunner('spec/features/some_feature_spec.js')
        @runner.run()

      it 'should compile application', =>
        expect(@compileSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should package application', =>
        expect(@packageSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should call mocha --recursive on feature spec', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features/some_feature_spec.js')]])

    describe 'coffeescript file', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['coffee']
        @runner = new SpecRunner('spec/features/some_feature_spec.coffee')
        @runner.run()

      it 'should call mocha --recursive on feature spec', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features/some_feature_spec.coffee'), '--compilers', 'coffee:coffee-script/register']])

    describe 'typescript file', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['ts']
        @runner = new SpecRunner('spec/features/some_feature_spec.ts')
        @runner.run()

      it 'should call mocha --recursive on feature spec', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features/some_feature_spec.ts'), '--compilers', 'ts:typescript-require']])

  describe 'feature spec directory', =>
    describe 'javascript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js']
        @runner = new SpecRunner('spec/features')
        @runner.run()

      it 'should compile application', =>
        expect(@compileSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should package application', =>
        expect(@packageSpy.withArgs(helper.platform(), 'test').calledOnce).to.be.true

      it 'should call mocha --recursive on features dir', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features')]])

    describe 'coffeescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['coffee']
        @runner = new SpecRunner('spec/features')
        @runner.run()

      it 'should call mocha --recursive on features dir', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features'), '--compilers', 'coffee:coffee-script/register']])

    describe 'typescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['ts']
        @runner = new SpecRunner('spec/features')
        @runner.run()

      it 'should call mocha --recursive on features dir', =>
        @packageSpy().then (a) =>
          expect(@runMochaSpy.calledOnce).to.be.true
          expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/features'), '--compilers', 'ts:typescript-require']])

  describe 'unit spec file', =>
    describe 'javascript file', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js']
        @runner = new SpecRunner('spec/units/some_unit_spec.js')
        @runner.run()

      it 'should call mocha --recursive on unit spec', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units/some_unit_spec.js')]])

      it 'should not compile app', =>
        expect(@compileSpy.calledOnce).to.be.false

      it 'should not package package', =>
        expect(@packageSpy.calledOnce).to.be.false

    describe 'coffeescript file', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['coffee']
        @runner = new SpecRunner('spec/units/some_unit_spec.coffee')
        @runner.run()

      it 'should call mocha --recursive on unit spec', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units/some_unit_spec.coffee'), '--compilers', 'coffee:coffee-script/register']])

    describe 'typescript file', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['ts']
        @runner = new SpecRunner('spec/units/some_unit_spec.ts')
        @runner.run()

      it 'should call mocha --recursive on unit spec', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units/some_unit_spec.ts'), '--compilers', 'ts:typescript-require']])

  describe 'unit spec directory', =>
    describe 'javascript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['js']
        @runner = new SpecRunner('spec/units')
        @runner.run()

      it 'should call mocha --recursive on units directory', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units')]])

      it 'should not compile app', =>
        expect(@compileSpy.calledOnce).to.be.false

      it 'should not package package', =>
        expect(@packageSpy.calledOnce).to.be.false

    describe 'coffeescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['coffee']
        @runner = new SpecRunner('spec/units')
        @runner.run()

      it 'should call mocha --recursive on units directory', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units'), '--compilers', 'coffee:coffee-script/register']])

    describe 'typescript files', =>
      beforeEach =>
        @utilsMock.uniqFileExtensions = -> ['ts']
        @runner = new SpecRunner('spec/units')
        @runner.run()

      it 'should call mocha --recursive on units directory', =>
        expect(@runMochaSpy.calledOnce).to.be.true
        expect(@runMochaSpy.getCall(0).args).to.eql([['--recursive', path.join(process.cwd(), 'spec/units'), '--compilers', 'ts:typescript-require']])
