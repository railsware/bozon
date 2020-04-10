import chalk from 'chalk'
import { Spinner } from 'utils/spinner'

let spinner = null

const formatMessage = (message, options = {}) => {
  let string = `[${chalk.cyan('bozon')}] ${message}`
  if (options.newLineBefore) {
    string = `\n${string}`
  }
  if (!options.skipLineAfter) {
    string = `${string}\n`
  }
  return string
}

const log = (message, options = {}) => {
  process.stdout.write(formatMessage(message, options))
}

const startSpinner = message => {
  spinner = new Spinner()
  spinner.start(formatMessage(message, { skipLineAfter: true }))
}

const stopSpinner = message => {
  spinner.stop(formatMessage(message))
}

const logReplace = (message) => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  log(message)
  process.stdout.cursorTo(0)
}

export { log, startSpinner, stopSpinner, logReplace }
