const path = require('path')
const { Application } = require('spectron')

const appPath = () => {
  switch (process.platform) {
    case 'darwin':
      return path.join(__dirname, '..', '.tmp', 'mac', '<%= name%>.app', 'Contents', 'MacOS', '<%= name%>')
    case 'linux':
      return path.join(__dirname, '..', '.tmp', 'linux', '<%= name%>')
    case 'win32':
      return path.join(__dirname, '..', '.tmp', 'win-unpacked', '<%= name%>.exe')
    default:
      throw Error(`Unsupported platform ${process.platform}`)
  }
}
global.app = new Application({ path: appPath() })
