import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import debounce from 'lodash.debounce'
import { copyHTMLFile } from 'builder/html'
import { bundle } from 'builder/bundle'
import { source, sourcePath, destinationPath, log, logReplace } from 'utils'

const DEBOUNCE = 1000

export const watch = (config, env, spinner) => {
  const watcher = chokidar.watch(sourcePath('**/*.*'), {
    ignored: /node_modules/,
    persistent: true
  })

  watcher.on('ready', () => {
    spinner.stopAndPersist({
      text: chalk.green('Watching for changes..\n'),
      symbol: '👀'
    })
  })

  watcher.on('change', debounce(
    (file) => handleChange(file, config, env), DEBOUNCE)
  )
}

const handleChange = (file, config, env) => {
  log(fileChangedMessage(path.relative(source(), file)))
  if (file.match(/src\/main/)) {
    processChange('~MAIN~', bundle(config.main))
  } else if (file.match(/src\/preload/)) {
    processChange('~PREL~', bundle(config.preload))
  } else if (file.match(/\.html$/)) {
    log(compilingMessage('RENDER'))
    processChange('RENDER', copyHTMLFile(file, htmlDestination(file, env)))
  } else {
    processChange('RENDER', bundle(config.renderer))
  }
}

const processChange = (key, processing) => {
  log(compilingMessage(key))
  const start = new Date()
  processing.then(() => {
    const end = new Date()
    const time = end.getTime() - start.getTime()
    logReplace(compilationDoneMessage(key, time))
  })
}

const htmlDestination = (file, env) =>
  destinationPath(path.join('renderer', path.parse(file).base), env)

const fileChangedMessage = file =>
  `[${chalk.green('CHANGE')}] ${chalk.grey('File')} ${chalk.bold(file)} ${chalk.grey('has been changed')}\n`

const compilingMessage = key =>
  `[${chalk.grey(key)}] ${chalk.grey('Compiling..')}`

const compilationDoneMessage = (key, time) =>
  `[${chalk.grey(key)}] ${chalk.cyan('Done')} ${chalk.grey(
    'in'
  )} ${time} ${chalk.grey('ms')}
  `
