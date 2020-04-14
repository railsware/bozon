const path = require('path')
const { Application } = require('spectron')

const appPath = () => {
  switch (process.platform) {
    case 'darwin':
      return path.join(__dirname, '..', '.tmp', 'mac', '<%= name%>.app', 'Contents', 'MacOS', '<%= name%>');
    case 'linux':
      return path.join(__dirname, '..', '.tmp', 'linux', '<%= name%>');
    default:
      throw Error('Unsupported platform');
  }
}
global.app = new Application({ path: appPath() })
