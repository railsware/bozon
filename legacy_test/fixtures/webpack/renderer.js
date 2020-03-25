module.exports = (env) => {
  let mode = env === 'test' ? 'development' : env
  return {
    "entry": `${process.cwd()}/test/assets/src/renderer/javascripts/index.js`,
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
      "path": `${process.cwd()}/test/assets/builds/${env}/renderer`
    },
    "resolve": {
      "modules": [
        `${process.cwd()}/test/assets/src/renderer/stylesheets`,
        `${process.cwd()}/test/assets/src/renderer/images`
      ]
    },
    "target": "electron-renderer"
  }
}
