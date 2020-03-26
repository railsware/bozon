import { sourcePath, destinationPath } from 'utils/bozon'

export default (mode, env) => {
  return {
    target: 'electron-preload',
    entry: sourcePath('preload/index.js'),
    mode: mode,
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      path: destinationPath('preload', env),
      filename: 'index.js'
    },
    plugins: []
  };
};
