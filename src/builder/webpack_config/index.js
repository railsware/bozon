import fs from 'fs'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { source, config } from 'utils'
import { mainDefaults, rendererDefaults, preloadDefaults } from './defaults'

const UNIQUENESS_KEYS = ['resolve.modules']
export default class WebpackConfig {
  constructor(env, platform) {
    this.env = env
    this.platform = platform
    this.localConfig()
  }

  build() {
    const configs = {
      main: this.merge(mainDefaults(this.mode(), this.env), this.config.main),
      renderer: this.merge(rendererDefaults(this.mode(), this.env), this.config.renderer),
      preload: this.merge(preloadDefaults(this.mode(), this.env), this.config.preload)
    }
    this.injectConfig(configs)
    return configs
  }

  merge(defaults, config) {
    return merge({
      customizeArray(a, b, key) {
        if (UNIQUENESS_KEYS.indexOf(key) !== 1) return Array.from(new Set([...a, ...b]))
      }
    })(defaults, config)
  }

  injectConfig(configs) {
    configs.main.plugins.push(
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(this.settings())
      })
    )
  }

  mode() {
    return this.env === 'test' ? 'development' : this.env
  }

  settings() {
    const json = JSON.parse(fs.readFileSync(source('package.json')))
    const settings = config(this.env, this.platform)
    settings.name = json.name
    settings.version = json.version
    return settings
  }

  localConfig() {
    const configFile = source('webpack.config.js')
    this.config = fs.existsSync(configFile)
      ? __non_webpack_require__(configFile)
      : {}
  }
}
