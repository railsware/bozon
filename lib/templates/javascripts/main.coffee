path = require('path')
electron = require('electron')
settings = require('../../package.json').settings

onClosed = ->
  mainWindow = null

electron.app.on 'ready', ->
  window = new electron.BrowserWindow width: settings.width, height: settings.height
  window.loadURL 'file://' + path.join(__dirname, '..', '..') + '/index.html'
  window.on 'closed', onClosed
