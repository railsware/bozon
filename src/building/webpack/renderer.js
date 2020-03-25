const bozon = require("./../../utils/bozon");

module.exports = (mode, env) => {
  return {
    target: "electron-renderer",
    entry: bozon.sourcePath("renderer/javascripts/index.js"),
    mode: mode,
    output: {
      path: bozon.destinationPath("renderer", env),
      filename: "index.js"
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
        bozon.sourcePath("renderer/stylesheets"),
        bozon.sourcePath("renderer/images")
      ]
    }
  };
};
