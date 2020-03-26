const file = jest.fn()
const get = jest.fn()
const Config = jest.fn(() => {
  return {
    file: file,
    get: get
  }
})
Config.file = file
Config.get = get

export default Config
