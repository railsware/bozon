require('application.css')

window.MessagesAPI.onLoaded((_, data) => {
  document.getElementById('title').innerHTML = data.appName + ' App'
  document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion
  document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion
})
