const bozon = require('utils/bozon');

module.exports = (mode, env) => {
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
