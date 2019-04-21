module.exports = (env) => {
  let mode = env === 'test' ? 'development' : env
  return {
    "entry": `${process.cwd()}/test/assets/src/javascripts/main/index.js`,
    "mode": mode,
    "node": {
      "__dirname": false,
      "__filename": false
    },
    "output": {
      "filename": "index.js",
      "path": `${process.cwd()}/test/assets/builds/${env}/javascripts/main`
    },
    "plugins": [
      {}
    ],
    "target": "electron-main"
  }
}
