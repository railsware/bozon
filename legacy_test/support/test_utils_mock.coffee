module.exports =
  uniqFileExtensions: sinon.mock().returns(['js'])
  isFile: sinon.mock().returns(false)
  extension: sinon.mock().returns('js')
