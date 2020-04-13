import fs from 'fs'
import chalk from 'chalk'
import Packager from 'packager'
import Checker from 'utils/checker'
import { platform, runJest, source } from 'utils'
import { log } from 'utils/logger'

const shouldPackageApp = (specPath) => {
  return specPath.match(/(spec|test)\/?$/) || specPath.match(/feature/)
}

const testDir = () => {
  return fs.existsSync(source('test')) ? './test' : './spec'
}

const run = path => {
  Checker.ensure()
  const specPath = !path ? testDir() : path

  return new Promise((resolve) => {
    if (shouldPackageApp(specPath)) {
      const packager = new Packager(platform(), 'test')
      packager.build().then(() => {
        log(chalk.bold('Running test suite...'))
        resolve(runJest([specPath]))
      })
    } else {
      log(chalk.bold('Running test suite...'))
      resolve(runJest([specPath]))
    }
  })
}

export const TestRunner = { run }
