import chalk from 'chalk'
import { ensureDirSync } from 'fs-extra'
import WebpackConfig from 'builder/webpack_config'
import { buildManifest } from 'builder/manifest'
import { buildHTML } from 'builder/html'
import { bundle } from 'builder/bundle'
import { watch } from 'builder/watcher'
import { source, sourcePath, destinationPath } from 'utils'
import { log, startSpinner, stopSpinner } from 'utils/logger'

const BUILD_START = chalk.bold('Building Electron application')
const BUILD_FAILED = `${chalk.yellow('Failed to build application')} ${chalk.red('✖')}`
const BUILD_SUCCEED = `${chalk.bold('Building Electron application')} ${chalk.green('✓')}`

const run = (platform, env, flags) => {
  startSpinner(BUILD_START)
  const config = new WebpackConfig(env, platform).build()
  ensureDirSync(destinationPath('', env))

  return Promise.all(buildQueue(config, env))
    .then(warnings => {
      onBuildSuccess(config, env, flags, warnings)
    })
    .catch(onBuildError)
}

const onBuildSuccess = (config, env, flags, warnings) => {
  stopSpinner(BUILD_SUCCEED)
  onBuildWarnings(warnings)
  if (env === 'development' && flags.reload) {
    watch(config, env)
  }
}

const onBuildError = error => {
  stopSpinner(BUILD_FAILED)
  log(chalk.grey(error))
  process.stdin.end()
  process.kill(process.pid)
}

const onBuildWarnings = warnings => {
  warnings.forEach(item => {
    if (item) log(chalk.yellow(`⚠ ${item}`))
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
