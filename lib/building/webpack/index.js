const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const bozon = require("./../../utils/bozon")
const mainDefault = require("./main")
const rendererDefault = require("./renderer")
const preloadDefault = require("./preload")

class WebpackConfig {
  constructor(env, platform) {
    this.env = env
    this.platform = platform
    this.rendererDefault = rendererDefault(this.mode(), this.env)
    this.mainDefault = mainDefault(this.mode(), this.env)
    this.preloadDefault = preloadDefault(this.mode(), this.env)
    this.localConfig()
  }

  build() {
    let configs = {
      renderer: Object.assign({}, this.rendererDefault, this.config.renderer),
      main: Object.assign({}, this.mainDefault, this.config.main)
    }
    if (this.config.preload) {
      configs.preload = Object.assign(
        {},
        this.preloadDefault,
        this.config.preload
      )
    }
    configs.main.plugins.push(
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(this.settings())
      })
    )
    return configs
  }

  mode() {
    return this.env === "test" ? "development" : this.env
  }

  settings() {
    const json = require(bozon.source("package.json"))
    let settings = bozon.config(this.env, this.platform)
    settings.name = json.name
    settings.version = json.version
    return settings
  }

  localConfig() {
    let configFile = bozon.source("webpack.config.js")
    this.config = fs.existsSync(configFile) ? require(configFile) : {}
  }
}

module.exports = WebpackConfig
