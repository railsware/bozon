import { sourcePath, destinationPath } from 'utils'

export default (mode, env) => {
  return {
    target: 'electron-main',
    entry: sourcePath('main/index.js'),
    mode: mode,
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      path: destinationPath('main', env),
      filename: 'index.js'
    },
    resolve: {
      modules: [sourcePath('resources')]
    },
    plugins: []
  };
};
