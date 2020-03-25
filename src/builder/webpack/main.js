const bozon = require('utils/bozon');

module.exports = (mode, env) => {
  return {
    target: 'electron-main',
    entry: bozon.sourcePath('main/index.js'),
    mode: mode,
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      path: bozon.destinationPath('main', env),
      filename: 'index.js'
    },
    resolve: {
      modules: [bozon.sourcePath('resources')]
    },
    plugins: []
  };
};
