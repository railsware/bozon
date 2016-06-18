var del = require('del')
var path = require('path')
var bozon = require('../bozon')

var Cleaner = (function () {
  function Cleaner () { }

  Cleaner.prototype.run = function () {
    del([path.join(process.cwd(), 'builds', '**')])
    del([path.join(process.cwd(), 'packages', '**')])
    del([path.join(process.cwd(), '.tmp', '**')])
  }

  return Cleaner
}
)()

module.exports = Cleaner
