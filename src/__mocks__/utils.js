export const isWindows = jest.fn().mockReturnValue(false)
export const isMacOS = jest.fn().mockReturnValue(false)
export const isLinux = jest.fn().mockReturnValue(true)
export const platform = jest.fn().mockReturnValue('linux')
export const source = jest.fn(value => `/test/home/${value}`)
export const sourcePath = jest.fn(value => `/test/home/src/${value}`)
export const nodeEnv = jest.fn().mockReturnValue({})
export const restoreCursorOnExit = jest.fn()
export const destinationPath = jest.fn(
  (value, env) => `/test/home/builds/${env}/${value}`
)
