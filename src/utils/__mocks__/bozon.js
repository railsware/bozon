const platform = jest.fn().mockReturnValue('mac')
const runElectron = jest.fn()
const runMocha = jest.fn()
const log = jest.fn()
const source = jest.fn(value => value)
const bozon = { platform, runElectron, runMocha, log, source }

export default bozon
