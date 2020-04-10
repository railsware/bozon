import chalk from 'chalk'
import Checker from 'utils/checker'
import { runElectron, platform } from 'utils'
import { Builder } from 'builder'
import { startSpinner, stopSpinner } from 'utils/logger'

const RUN_START = chalk.bold('Starting application')
const RUN_SUCCESS = `${chalk.bold('Starting application')} ${chalk.green('✓')}`

const run = params => {
  Checker.ensure()
  Builder.run(platform(), 'development', params.flags)
    .then(() => onBuildSuccess(params))
    .catch(() => {})
}

const onBuildSuccess = params => {
  startSpinner(RUN_START)
  runElectron(params.options)
  stopSpinner(RUN_SUCCESS)
}

export const Starter = { run }
