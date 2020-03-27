const mkdirSync = jest.fn()
const readFileSync = jest.fn((filename) => {
  if (filename === '/test/home/package.json') {
    return '{}'
  }
  return `${filename.split('/').slice(-1)[0]} contents`
})
const readdirSync = jest.fn().mockReturnValue([])
const writeFileSync = jest.fn()
const writeFile = jest.fn()
const lstatSync = jest.fn(dir => {
  return {
    isFile: jest.fn()
  }
})
const existsSync = jest.fn()

export default { mkdirSync, readFileSync, writeFile, writeFileSync, lstatSync, existsSync, readdirSync }
