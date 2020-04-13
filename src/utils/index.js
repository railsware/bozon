import path from 'path'
import { spawn, spawnSync } from 'child_process'
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

export const runElectron = (params = [], flags) => {
  let options

  if (flags.reload) {
    options = [
      'nodemon',
      `-w ${path.join('builds', 'development', 'main')}`,
      '-e js',
      '-q',
      path.join('node_modules', '.bin', 'electron'),
      path.join('builds', 'development')
    ]
  } else {
    options = ['electron', path.join('builds', 'development')]
  }
  subscribeOnExit()
  spawn('npx', options.concat(params), {
    env: nodeEnv('development'),
    shell: true,
    stdio: 'inherit'
  })
}

export const runJest = (params) => {
  subscribeOnExit()
  spawnSync('npx', ['jest', '-i'].concat(params), {
    env: nodeEnv('test'),
    shell: true,
    stdio: 'inherit'
  })
}

export const runMocha = (params = []) => {
  const options = ['mocha'].concat(params)
  subscribeOnExit()
  spawnSync('npx', options, {
    env: nodeEnv('test'),
    shell: true,
    stdio: 'inherit'
  })
}

export const platform = () => {
  const os = process.platform
  if (os === 'mac' || os === 'darwin') {
    return 'mac'
  } else if (os === 'windows' || os === 'win32') {
    return 'windows'
  } else if (os === 'linux') {
    return 'linux'
  } else {
    throw new Error('Unsupported platform ' + os)
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
const subscribeOnExit = () => {
  process.on('SIGINT', () => process.exit())
  process.on('exit', () => console.log('\x1B[?25h'))
}

const nodeEnv = (value) => {
  const env = Object.create(process.env)
  env.NODE_ENV = value
  return env
}
