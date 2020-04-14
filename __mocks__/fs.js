let fileList = []

const __setFileList = (list) => {
  fileList = list
}

const mkdirSync = jest.fn()
export const readFileSync = jest.fn((filename) => {
  if (filename === '/test/home/package.json') {
    return '{}'
  }
  return `${filename.split('/').slice(-1)[0]} contents`
})
export const readdirSync = jest.fn(() => fileList)
export const writeFileSync = jest.fn()
export const writeFile = jest.fn((_, out, fn) => {
  fn(null)
})
const lstatSync = jest.fn((dir) => {
  return {
    isFile: jest.fn()
  }
})
const existsSync = jest.fn().mockReturnValue(true)

export default {
  mkdirSync,
  readFileSync,
  writeFile,
  writeFileSync,
  lstatSync,
  existsSync,
  readdirSync,
  __setFileList
}
