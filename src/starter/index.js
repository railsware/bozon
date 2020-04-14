import path from 'path'
import { spawn } from 'child_process'
import Checker from 'utils/checker'
import { platform, nodeEnv, subscribeOnExit } from 'utils'
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
  runApplication(params.options, params.flags)
  stopSpinner(RUN_SUCCESS)
}

const runApplication = (params = [], flags) => {
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

export const Starter = { run }
