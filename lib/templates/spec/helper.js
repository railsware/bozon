var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', "<%= name%>-" + process.platform + "-" + process.arch, '<%= name%>.app', 'Contents', 'MacOS', '<%= name%>');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', "<%= name%>-" + process.platform + "-" + process.arch, '<%= name%>');
      default:
        throw 'Unsupported platform';
    }
  }
};
