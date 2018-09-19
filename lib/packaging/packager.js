var path = require('path')
var bozon = require('../bozon')
var Checker = require('../utils/checker')
var Builder = require('../building/builder')

class Packager {
  constructor(platform, environment, publish) {
    Checker.ensure()
    this.name = require(path.join(process.cwd(), 'package.json')).name
    this.version = require('../../package.json').versions['electron']
    this.platform = platform
    this.environment = environment
    this.publish = publish ? 'always' : 'never'
    this.electronBuilder = bozon.requireLocal('electron-builder')
  }

  build() {
    new Builder(this.platform, this.environment).run()
    if (this.environment === 'test') {
      return this.testBuild(this.platform)
    } else {
      return this.productionBuild(this.platform, this.environment)
    }
  }

  testBuild(platform) {
    process.env.CSC_IDENTITY_AUTO_DISCOVERY = false

    return this.electronBuilder.build({
      targets: this.electronBuilder.Platform[platform.toUpperCase()].createTarget(),
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
  }

  productionBuild(platform, environment) {
    return this.electronBuilder.build({
      targets: this.electronBuilder.Platform[platform.toUpperCase()].createTarget(),
      config: {
        directories: {
          app: path.join('builds', environment),
          buildResources: 'resources',
          output: 'packages'
        }
      },
      "publish": this.publish
    }).catch(function (error) {
      console.log(error)
    })
  }
}

module.exports = Packager
