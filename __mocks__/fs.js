const mkdirSync = jest.fn()
const readFileSync = jest.fn((filename) => {
  return `${filename.split('/').slice(-1)[0]} contents`
})
const readdirSync = jest.fn().mockReturnValue([])
const writeFileSync = jest.fn()
const lstatSync = jest.fn(() => {
  return {
    isFile: jest.fn()
  }
})
const existsSync = jest.fn()

export default { mkdirSync, readFileSync, writeFileSync, lstatSync, existsSync, readdirSync }
