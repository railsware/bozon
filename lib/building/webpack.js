const fs = require('fs')
const path = require('path')
const bozon = require('./../bozon')

class WebpackConfig {
  constructor(env) {
    this.env = env
    this.default = {
      target: "electron-renderer",
      entry: bozon.sourcePath("javascripts/renderer/application.js"),
      mode: this.mode(),
      output: {
        path: bozon.destinationPath("javascripts/renderer", this.env),
        filename: "application.js"
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
  }

  build() {
    return Object.assign({}, this.default, this.localConfig())
  }

  mode() {
    return this.env === 'test' ? 'development' : this.env
  }

  localConfig() {
    let configFile = path.join(process.cwd(), '/webpack.config.js')
    return fs.existsSync(configFile) ? require(configFile) : {}
  }
}

module.exports = WebpackConfig
