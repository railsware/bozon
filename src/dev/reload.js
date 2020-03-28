import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const browserWindows = {}
const electron = path.join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'electron')

const reloadRenderer = () => {
  Object.values(browserWindows).forEach(window => window.webContents.reloadIgnoringCache())
}

// eslint-disable-next-line no-unused-vars
const _reloadMain = () => {
  const child = spawn(electron, [app.getAppPath()], {
    detached: true,
    stdio: 'inherit'
  })
  child.unref()
  if (app) app.quit()
}

app.on('browser-window-created', (_, bw) => {
  browserWindows[bw.id] = bw
  bw.on('closed', () => {
    delete browserWindows[bw.id]
  })
})

fs.watch(path.resolve(__dirname, '..', 'renderer'), {}, reloadRenderer)

// Disable main process reloading for now
// fs.watch(path.resolve(__dirname, '..', 'preload'), {}, reloadMain)
// fs.watch(path.resolve(__dirname), {}, reloadMain)
