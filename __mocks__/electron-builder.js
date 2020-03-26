const createTarget = jest.fn().mockReturnValue('MAC_TARGET')
const build = jest.fn().mockResolvedValue(true)

const Platform = {
  MAC: {
    createTarget: createTarget
  }
}
const electronBuilder = {
  Platform: Platform,
  build: build
}

module.exports = electronBuilder
