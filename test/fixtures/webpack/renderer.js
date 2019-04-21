module.exports = (env) => {
  let mode = env === 'test' ? 'development' : env
  return {
    "entry": `${process.cwd()}/test/assets/src/javascripts/renderer/index.js`,
    "mode": mode,
    "module": {
      "rules": [
        {
          "test": /\.css$/,
          "use": [
            {
              "loader": "style-loader"
            },
            {
              "loader": "css-loader"
            }
          ]
        }
      ]
    },
    "output": {
      "filename": "index.js",
      "path": `${process.cwd()}/test/assets/builds/${env}/javascripts/renderer`
    },
    "resolve": {
      "modules": [
        `${process.cwd()}/test/assets/src/stylesheets`,
        `${process.cwd()}/test/assets/src/images`
      ]
    },
    "target": "electron-renderer"
  }
}
