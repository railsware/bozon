const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const electronBuilder = require('electron-builder')
const Checker = require('../utils/checker')
const Builder = require('../building/builder')

class Packager {
  constructor(platform, environment, publish) {
    Checker.ensure()
    this.platform = platform
    this.environment = environment
    this.publish = publish ? 'always' : 'never'
    this.spinner = ora({
      text: chalk.cyan('Packaging Electron application'),
      color: 'cyan'
    })
  }

  build() {
    this.builder = new Builder(this.platform, this.environment)
    return this.builder.run().then(() => {
      this.spinner.start()
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
    }).then(() => {
      this.spinner.succeed()
    }).catch((error) => {
      this.spinner.fail()
      console.log(error)
    })
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
      "publish": this.publish
    }).then(() => {
      this.spinner.succeed()
    }).catch((error) => {
      this.spinner.fail()
      console.log(error)
    })
  }
}

module.exports = Packager
