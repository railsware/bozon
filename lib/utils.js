var path = require('path');

module.exports.argument = function (name) {
  var regexp = new RegExp('--' + name + '=');
  var arg = process.argv.find(function (item) {
    return item.match(regexp);
  });
  if (arg) {
    return arg.split('=')[1];
  } else {
    return null;
  }
};
