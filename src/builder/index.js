import chalk from 'chalk'
import { ensureDirSync } from 'fs-extra'
import WebpackConfig from 'builder/webpack_config'
import { buildManifest } from 'builder/manifest'
import { buildHTML } from 'builder/html'
import { bundle } from 'builder/bundle'
import { watch } from 'builder/watcher'
import { source, sourcePath, destinationPath } from 'utils'
import { log, warn, startSpinner, stopSpinner } from 'utils/logger'
import { inspect }  from 'util'

const BUILD_START = 'Building Electron application'
const BUILD_FAILED = 'Failed to build application'
const BUILD_SUCCEED = 'Building Electron application'

const run = (platform, env, flags) => {
  startSpinner(BUILD_START)
  const config = new WebpackConfig(env, platform, flags).build()
  ensureDirSync(destinationPath('', env))

  return Promise.all(buildQueue(config, env, flags))
    .then(warnings => {
      onBuildSuccess(config, env, warnings)
    })
    .catch(onBuildError)
}

const onBuildSuccess = (config, env, warnings) => {
  stopSpinner(BUILD_SUCCEED)
  onBuildWarnings(warnings)
  if (env === 'development') {
    watch(config, env)
  }
}

const onBuildError = error => {
  stopSpinner(BUILD_FAILED, false)
  log(chalk.grey(inspect(error)))
  process.stdin.end()
  process.kill(process.pid)
}

const onBuildWarnings = warnings => {
  warnings.forEach(item => {
    if (item) warn(item)
  })
}

const buildQueue = (config, env) => {
  return [
    buildHTML(sourcePath('renderer'), destinationPath('renderer', env)),
    buildManifest(source('package.json'), destinationPath('package.json', env)),
    bundle(config.renderer),
    bundle(config.main),
    bundle(config.preload)
  ]
}

export const Builder = { run }
