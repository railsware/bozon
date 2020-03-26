import bozon from 'utils/bozon'

export default (mode, env) => {
  return {
    target: 'electron-preload',
    entry: bozon.sourcePath('preload/index.js'),
    mode: mode,
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      path: bozon.destinationPath('preload', env),
      filename: 'index.js'
    },
    plugins: []
  };
};
