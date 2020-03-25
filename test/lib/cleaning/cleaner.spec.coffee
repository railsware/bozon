helper = require('../../helper')

ora = require('../../support/ora_mock')
del = sinon.spy()

mock('ora', ora)
mock('del', del)

Cleaner = require('../../../src/clearing/cleaner')

describe 'Cleaner', ->
  describe '#run', ->
    before ->
      cleaner = new Cleaner()
      cleaner.run()

    after ->
      ora.resetHistory()
      ora.start.resetHistory()
      ora.succeed.resetHistory()

    it 'sets cleaner spinner', ->
      expect(ora.getCall(0).args[0]).to.eql({
        text: '\u001b[36mCleaning app directory\u001b[39m'
        color: 'cyan'
      })

    it 'starts spinner', ->
      expect(ora.start.calledOnce).to.be.true

    it 'clears builds directory', ->
      expect(del.getCall(0).args[0]).to.eql(["#{process.cwd()}/builds/**"])

    it 'clears packages directory', ->
      expect(del.getCall(1).args[0]).to.eql(["#{process.cwd()}/packages/**"])

    it 'clears tmp directory', ->
      expect(del.getCall(2).args[0]).to.eql(["#{process.cwd()}/.tmp/**"])

    it 'stops spinner with success', ->
      expect(ora.succeed.calledOnce).to.be.true

mock.stopAll()
