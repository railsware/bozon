import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const browserWindows = {}

const reloadRenderer = () => {
  Object.values(browserWindows).forEach(window => window.webContents.reloadIgnoringCache())
}

app.on('browser-window-created', (_, bw) => {
  browserWindows[bw.id] = bw
  bw.on('closed', () => {
    delete browserWindows[bw.id]
  })
})

fs.watch(path.resolve(__dirname, '..', 'renderer'), {}, reloadRenderer)
