import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const browserWindows = []

const reloadRenderer = () => {
  Object.values(browserWindows).forEach(window => {
    if (window) window.webContents.reloadIgnoringCache()
  })
}

app.on('browser-window-created', (_, bw) => {
  browserWindows.push(bw)
  bw.on('closed', () => {
    console.log(browserWindows.indexOf(bw))
    browserWindows.splice(browserWindows.indexOf(bw), 1)
  })
})

fs.watch(path.resolve(__dirname, '..', 'renderer'), {}, reloadRenderer)
