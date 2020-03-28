const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js'),
    dev: path.resolve(__dirname, 'src', 'dev', 'index.js')
  },
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    modules: ['node_modules', 'src']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    esmodules: true
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
