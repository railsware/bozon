var del = require('del')
var path = require('path')

class Cleaner {
  run() {
    del([path.join(process.cwd(), 'builds', '**')])
    del([path.join(process.cwd(), 'packages', '**')])
    del([path.join(process.cwd(), '.tmp', '**')])
  }
}

module.exports = Cleaner
