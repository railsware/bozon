export const platform = jest.fn().mockReturnValue('linux')
export const runElectron = jest.fn()
export const runMocha = jest.fn()
export const runJest = jest.fn()
export const source = jest.fn(value => `/test/home/${value}`)
export const sourcePath = jest.fn(value => `/test/home/src/${value}`)
export const destinationPath = jest.fn(
  (value, env) => `/test/home/builds/${env}/${value}`
)
