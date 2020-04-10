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

export const runElectron = (params = []) => {
  const env = Object.create(process.env)
  const options = [
    'nodemon',
    `-w ${path.join('builds', 'development', 'main')}`,
    '-e js',
    '--delay 1',
    '-q',
    path.join('node_modules', '.bin', 'electron'),
    path.join('builds', 'development')
  ].concat(params)
  // const options = [
  //   'npx',
  //   'electron',
  //   path.join('builds', 'development')
  // ].concat(params)
  env.NODE_ENV = 'development'
  return spawn('npx', options, {
    env: env,
    shell: true,
    stdio: 'inherit'
  })
}

export const runMocha = (params = []) => {
  const env = Object.create(process.env)
  env.NODE_ENV = 'test'
  const options = ['mocha'].concat(params)
  return spawnSync('npx', options, {
    env: env,
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
