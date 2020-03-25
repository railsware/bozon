start = sinon.spy()
succeed = sinon.spy()
fail = sinon.spy()
stopAndPersist = sinon.spy()

ora = sinon.mock().returns start: start, succeed: succeed, fail: fail, stopAndPersist: stopAndPersist
ora.start = start
ora.succeed = succeed
ora.fail = fail
ora.stopAndPersist = stopAndPersist

module.exports = ora
