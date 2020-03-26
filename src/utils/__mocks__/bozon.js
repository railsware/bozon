const platform = jest.fn().mockReturnValue('mac')
const runElectron = jest.fn()
const log = jest.fn()
const bozon = { platform, runElectron, log }

export default bozon
