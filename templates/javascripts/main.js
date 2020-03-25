import electron from 'electron'
import path from 'path'

electron.app.on('ready', function() {
  let window = new electron.BrowserWindow({
    title: CONFIG.name,
    width: CONFIG.width,
    height: CONFIG.height,
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.loadURL(`file://${path.join(__dirname, '..', 'renderer', 'index.html')}`)

  window.webContents.on('did-finish-load', function(){
    window.webContents.send('loaded', {
      appName: CONFIG.name,
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      chromiumVersion: process.versions.chrome
    })
  })

  window.on('closed', function() {
    window = null
  })
})
