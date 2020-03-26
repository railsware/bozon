import path from 'path'
import childProcess from 'child_process'
import Config from 'merge-config'

const srcDir = 'src'

const binary = name => {
  return path.join(process.cwd(), 'node_modules', '.bin', name)
}

const spawn = (command, options, environment) => {
  const env = Object.create(process.env)
  if (env) env.NODE_ENV = environment
  return childProcess.spawn(command, options, {
    shell: true,
    env: env,
    stdio: 'inherit'
  })
}

const spawnSync = (command, options, environment) => {
  const env = Object.create(process.env)
  if (env) env.NODE_ENV = environment
  return childProcess.spawnSync(command, options, {
    shell: true,
    env: env,
    stdio: 'inherit'
  })
}

export const source = function() {
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

export const runElectron = options => {
  if (typeof options === 'undefined') {
    options = []
  }
  options = options.concat([
    path.join(process.cwd(), 'builds', 'development')
  ])
  return spawn(binary('electron'), options, 'development')
}

export const runMocha = params => {
  return spawnSync(binary('mocha'), params)
}

export const platform = () => {
  const os = process.platform;
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
