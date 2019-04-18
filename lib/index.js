const ora = require('ora')
const chalk = require('chalk')
const electron = require('electron')
const chokidar = require('chokidar')
const bozon = require('./utils/bozon')
const spinner = ora({
  text: chalk.cyan('Building Electron application'),
  color: 'cyan'
})

const isDev = () => {
  const isEnvSet = 'ELECTRON_IS_DEV' in process.env
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
  return isEnvSet ? getFromEnv : !electron.app.isPackaged
}

const watchRenderer = () => {
  if (isDev()) {
    const watcher = chokidar.watch(
      bozon.destinationPath('javascripts/renderer', this.environment), {
        ignored: ['node_modules']
      }
    )
    watcher.on('ready', () => {
      spinner.stopAndPersist({text: chalk.green('Watching for changes..'), symbol: '👀'})
    })
    watcher.on('change', filePath => {
      console.log('Changed ' + filePath)
      for (const win of electron.BrowserWindow.getAllWindows()) {
      	win.webContents.reloadIgnoringCache()
      }
    })
  }
}

module.exports = watchRenderer()
