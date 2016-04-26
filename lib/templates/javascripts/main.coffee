electron = require('electron')
settings = require('./package.json').settings

onClosed = ->
  mainWindow = null

electron.app.on 'ready', ->
  window = new electron.BrowserWindow width: settings.width, height: settings.height
  window.loadURL 'file://' + __dirname + '/index.html'
  window.on 'closed', onClosed
