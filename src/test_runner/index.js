import chalk from 'chalk'
import { spawnSync } from 'child_process'
import Packager from 'packager'
import Checker from 'utils/checker'
import { platform, nodeEnv } from 'utils'
import { log } from 'utils/logger'

const run = path => {
  Checker.ensure()
  if (!path || path.match(/features/)) {
    return buildAndRun(path)
  } else {
    log(chalk.bold('Running test suite...'))
    return runUnitTests(path)
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
  const result = spawnSync('npx', ['jest', '-i', path], {
    env: nodeEnv('test'),
    shell: true,
    stdio: 'inherit'
  })
  return buildPromise(result.status)
}

const runUnitTests = path => {
  const result = spawnSync('npx', ['jest', path], {
    env: nodeEnv('test'),
    shell: true,
    stdio: 'inherit'
  })
  return buildPromise(result.status)
}

const runAllTests = () => {
  return Promise.all([
    runUnitTests('./test/units'),
    runFeatureTests('./test/features')
  ])
}

const buildPromise = status => {
  return (status === 0)
    ? Promise.resolve()
    : Promise.reject(Error('Some tests failed'))
}

export const TestRunner = { run }
