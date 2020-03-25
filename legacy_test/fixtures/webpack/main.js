module.exports = (env) => {
  let mode = env === 'test' ? 'development' : env
  return {
    "entry": `${process.cwd()}/test/assets/src/main/index.js`,
    "mode": mode,
    "node": {
      "__dirname": false,
      "__filename": false
    },
    "output": {
      "filename": "index.js",
      "path": `${process.cwd()}/test/assets/builds/${env}/main`
    },
    "resolve": {
      "modules": [
        `${process.cwd()}/test/assets/src/resources`
      ]
    },
    "plugins": [
      {}
    ],
    "target": "electron-main"
  }
}
