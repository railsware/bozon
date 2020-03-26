const mkdirSync = jest.fn()
const readFileSync = jest.fn((filename) => {
  return `${filename.split('/').slice(-1)[0]} contents`
})
const writeFileSync = jest.fn()

export default { mkdirSync, readFileSync, writeFileSync }
