let fileList = []

const __setFileList = (list) => {
  fileList = list
}

const mkdirSync = jest.fn()
const readFileSync = jest.fn((filename) => {
  if (filename === '/test/home/package.json') {
    return '{}'
  }
  return `${filename.split('/').slice(-1)[0]} contents`
})
const readdirSync = jest.fn(() => fileList)
const writeFileSync = jest.fn()
const writeFile = jest.fn()
const lstatSync = jest.fn((dir) => {
  return {
    isFile: jest.fn()
  }
})
const existsSync = jest.fn()

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
