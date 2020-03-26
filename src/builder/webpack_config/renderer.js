import { sourcePath, destinationPath } from 'utils/bozon'

export default (mode, env) => {
  return {
    target: 'electron-renderer',
    entry: sourcePath('renderer/javascripts/index.js'),
    mode: mode,
    output: {
      path: destinationPath('renderer', env),
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      modules: [
        sourcePath('renderer/stylesheets'),
        sourcePath('renderer/images')
      ]
    }
  };
};
