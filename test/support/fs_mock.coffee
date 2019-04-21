existsSync = sinon.mock().returns(true)
writeFile = sinon.spy()
writeFileSync = sinon.spy()
readdirSync = sinon.spy()
lstatSync = sinon.mock().returns
  isFile: sinon.spy()

module.exports =
  existsSync: existsSync
  writeFile: writeFile
  writeFileSync: writeFileSync
  lstatSync: lstatSync
  readdirSync: readdirSync
