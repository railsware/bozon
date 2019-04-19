const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const bozon = require('./../utils/bozon')

class WebpackConfig {
  constructor(env, platform) {
    this.env = env
    this.platform = platform
    this.buildSettings()
    this.localConfig()
    this.rendererDefault = {
      target: "electron-renderer",
      entry: bozon.sourcePath("javascripts/renderer/index.js"),
      mode: this.mode(),
      output: {
        path: bozon.destinationPath("javascripts/renderer", this.env),
        filename: "index.js"
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader"
              },
              {
                loader: "css-loader"
              }
            ]
          }
        ]
      },
      resolve: {
        modules: [
          bozon.sourcePath("stylesheets"),
          bozon.sourcePath("images")
        ]
      }
    }
    this.mainDefault = {
      target: "electron-main",
      entry: bozon.sourcePath("javascripts/main/index.js"),
      mode: this.mode(),
      node: {
        __dirname: false,
        __filename: false
      },
      output: {
        path: bozon.destinationPath("javascripts/main", this.env),
        filename: "index.js"
      },
      plugins: [
        new webpack.DefinePlugin({
          SETTINGS: JSON.stringify(this.settings)
        })
      ]
    }
  }

  build() {
    return {
      renderer: Object.assign({}, this.rendererDefault, this.config.renderer),
      main: Object.assign({}, this.mainDefault, this.config.main)
    }
  }

  mode() {
    return this.env === 'test' ? 'development' : this.env
  }

  buildSettings() {
    const json = require(bozon.source('package.json'))
    this.settings = bozon.config(this.env, this.platform)
    this.settings.name = json.name
    this.settings.version = json.version
  }

  localConfig() {
    let configFile = path.join(process.cwd(), '/webpack.config.js')
    this.config = fs.existsSync(configFile) ? require(configFile) : {}
  }
}

module.exports = WebpackConfig
