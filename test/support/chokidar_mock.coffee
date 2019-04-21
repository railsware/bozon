chokidarOn = sinon.spy()
chokidarWatch = sinon.mock().returns(on: chokidarOn)
module.exports =
  watch: chokidarWatch
  on: chokidarOn
