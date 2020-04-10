import Checker from 'utils/checker'
import { runElectron, platform } from 'utils'
import { Builder } from 'builder'
import { startSpinner, stopSpinner } from 'utils/logger'

const RUN_START = 'Starting application'
const RUN_SUCCESS = 'Starting application'

const run = params => {
  Checker.ensure()
  Builder.run(platform(), 'development', params.flags)
    .then(() => onBuildSuccess(params))
    .catch(() => {})
}

const onBuildSuccess = params => {
  startSpinner(RUN_START)
  runElectron(params.options, params.flags)
  stopSpinner(RUN_SUCCESS)
}

export const Starter = { run }
