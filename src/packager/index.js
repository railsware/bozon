import path from 'path'
import chalk from 'chalk'
import Checker from 'utils/checker'
import { Builder } from 'builder'
import { log, startSpinner, stopSpinner } from 'utils/logger'

const electronBuilder = require('electron-builder')

export default class Packager {
  constructor(platform, environment, publish) {
    Checker.ensure()
    this.platform = platform
    this.environment = environment
    this.publish = publish ? 'always' : 'never'
  }

  build() {
    return Builder.run(this.platform, this.environment).then(() => {
      startSpinner(chalk.bold('Packaging Electron application'))
      if (this.environment === 'test') {
        return this.testBuild(this.platform)
      } else {
        return this.productionBuild(this.platform, this.environment)
      }
    })
  }

  testBuild(platform) {
    process.env.CSC_IDENTITY_AUTO_DISCOVERY = false
    return electronBuilder.build({
      targets: electronBuilder.Platform[platform.toUpperCase()].createTarget(),
      config: {
        mac: {
          target: ['dir']
        },
        linux: {
          target: ['dir']
        },
        win: {
          target: ['dir']
        },
        directories: {
          app: path.join('builds', 'test'),
          buildResources: 'resources',
          output: '.tmp'
        }
      }
    })
      .then(this.onSuccess)
      .catch(this.onError)
  }

  productionBuild(platform, environment) {
    return electronBuilder.build({
      targets: electronBuilder.Platform[platform.toUpperCase()].createTarget(),
      config: {
        directories: {
          app: path.join('builds', environment),
          buildResources: 'resources',
          output: 'packages'
        }
      },
      publish: this.publish
    })
      .then(this.onSuccess)
      .catch(this.onError)
  }

  onSuccess() {
    stopSpinner(`${chalk.bold('Packaging Electron application')} ${chalk.green('✓')}`)
  }

  onError(error) {
    stopSpinner(`${chalk.yellow('Packaging Electron application')} ${chalk.red('✖')}`)
    log(error)
  }
}
