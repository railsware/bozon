import chalk from 'chalk'
import { spawnSync } from 'child_process'
import Packager from 'packager'
import Checker from 'utils/checker'
import { platform, nodeEnv } from 'utils'
import { log } from 'utils/logger'

const run = path => {
  Checker.ensure()
  if (!path || path.match(/features/)) {
    buildAndRun(path)
  } else {
    log(chalk.bold('Running test suite...'))
    runUnitTests(path)
  }
}

const buildAndRun = path => {
  return new Packager(platform(), 'test').build().then(() => {
    log(chalk.bold('Running test suite...'))
    if (!path) {
      return runAllTests()
    }
    return runFeatureTests(path)
  })
}

const runFeatureTests = path => {
  spawnSync('npx', ['jest', '-i', path], {
    env: nodeEnv('test'),
    shell: true,
    stdio: 'inherit'
  })
}

const runUnitTests = path => {
  spawnSync('npx', ['jest', path], {
    env: nodeEnv('test'),
    shell: true,
    stdio: 'inherit'
  })
}

const runAllTests = () => {
  runUnitTests('./test/units')
  runFeatureTests('./test/features')
  return Promise.resolve()
}

export const TestRunner = { run }
