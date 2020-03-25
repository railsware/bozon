var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'mac', '<%= name%>.app', 'Contents', 'MacOS', '<%= name%>');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'linux', '<%= name%>');
      default:
        throw 'Unsupported platform';
    }
  }
};
