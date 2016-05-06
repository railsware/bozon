var electron, path, settings;

path = require('path');

electron = require('electron');

settings = require('../../package.json').settings;

electron.app.on('ready', function() {
  var window;
  window = new electron.BrowserWindow({
    width: settings.width,
    height: settings.height
  });
  window.loadURL('file://' + path.join(__dirname, '..', '..') + '/index.html');
  return window.on('closed', function() {
    window = null;
  });
});
