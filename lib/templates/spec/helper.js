var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', '<%= name%>-darwin-x64', '<%= name%>.app', 'Contents', 'MacOS', '<%= name%>');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', '<%= name%>-linux-x64', '<%= name%>');
      default:
        throw 'Unsupported platform';
    }
  }
};
