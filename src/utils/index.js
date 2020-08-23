import path from 'path'
import Config from 'merge-config'

const srcDir = 'src'

export const source = function () {
  const prefix = process.cwd()
  const suffix = path.join.apply(null, arguments)
  return path.join(prefix, suffix)
}

export const sourcePath = (suffix) => {
  if (suffix == null) {
    suffix = ''
  }
  return path.join(process.cwd(), srcDir, suffix)
}

export const destinationPath = (suffix, env) => {
  if (suffix == null) {
    suffix = ''
  }
  return path.join(process.cwd(), 'builds', env, suffix)
}

export const isWindows = () => {
  const { platform } = process
  return platform === 'windows' || platform === 'win32'
}

export const isMacOS = () => {
  const { platform } = process
  return platform === 'mac' || platform === 'darwin'
}

export const isLinux = () => {
  const { platform } = process
  return platform === 'linux'
}

export const platform = () => {
  if (isMacOS()) {
    return 'mac'
  } else if (isWindows()) {
    return 'windows'
  } else if (isLinux()) {
    return 'linux'
  } else {
    throw new Error('Unsupported platform ' + process.platform)
  }
}

export const config = (env, platform) => {
  const config = new Config()
  config.file(source('config', 'settings.json'))
  config.file(source('config', 'environments', env + '.json'))
  config.file(source('config', 'platforms', platform + '.json'))
  return config.get()
}

// Put back cursor to console on exit
export const restoreCursorOnExit = () => {
  process.on('SIGINT', () => process.exit())
  process.on('exit', () => console.log('\x1B[?25h'))
}

export const nodeEnv = (value) => {
  const env = Object.create(process.env)
  env.NODE_ENV = value
  return env
}
