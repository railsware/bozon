import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import { copyHTMLFile } from 'builder/html'
import { bundle } from 'builder/bundle'
import { source, sourcePath, destinationPath } from 'utils'
import { log, startSpinner, stopSpinner } from 'utils/logger'

const MAIN_KEY = '~MAIN~'
const RENDER_EKY = 'RENDER'
const PRELOAD_KEY = '~PREL~'

export const watch = (config, env) => {
  const watcher = chokidar.watch(sourcePath('**/*.*'), {
    ignored: /node_modules/,
    persistent: true
  })

  watcher.on('ready', () => {
    log(`${chalk.cyan('Watching for changes')} 👀\n`)
  })

  watcher.on('change', (file) => handleChange(file, config, env))
}

const handleChange = (file, config, env) => {
  log(fileChangedMessage(path.relative(source(), file)))
  if (file.match(/src\/main/)) {
    processChange(MAIN_KEY, bundle(config.main))
  } else if (file.match(/src\/preload/)) {
    processChange(PRELOAD_KEY, bundle(config.preload))
  } else if (file.match(/\.html$/)) {
    log(compilingMessage(RENDER_EKY))
    processChange(RENDER_EKY, copyHTMLFile(file, htmlDestination(file, env)))
  } else {
    processChange(RENDER_EKY, bundle(config.renderer))
  }
}

const processChange = (key, processing) => {
  startSpinner(compilingMessage(key))
  const start = new Date()
  processing.then(() => {
    const end = new Date()
    const time = end.getTime() - start.getTime()
    stopSpinner(compilationDoneMessage(key, time))
  })
}

const htmlDestination = (file, env) =>
  destinationPath(path.join('renderer', path.parse(file).base), env)

const fileChangedMessage = (file) =>
  `[${chalk.green('CHANGE')}] ${chalk.grey('File')} ${chalk.bold(
    file
  )} ${chalk.grey('has been changed')}`

const compilingMessage = (key) =>
  `[${chalk.grey(key)}] ${chalk.grey('Compiling')}`

const compilationDoneMessage = (key, time) =>
  `[${chalk.grey(key)}] ${chalk.cyan('Compiled')} ${chalk.grey(
    'in'
  )} ${time} ${chalk.grey('ms')}`
