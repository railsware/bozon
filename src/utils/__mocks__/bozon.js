export const platform = jest.fn().mockReturnValue('mac')
export const runElectron = jest.fn()
export const runMocha = jest.fn()
export const log = jest.fn()
export const source = jest.fn(value => value)
export const sourcePath = jest.fn(value => `/test/home/src/${value}`)
export const destinationPath = jest.fn(
  (value, env) => `/test/home/builds/${env}/${value}`
)
