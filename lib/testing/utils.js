var fs = require('fs')
var path = require('path')

module.exports.isFile = function (pathString) {
  return fs.lstatSync(pathString).isFile()
}

module.exports.readFileList = function (pathString, filelist) {
  var _this = this
  filelist = filelist || []

  var files = fs.readdirSync(pathString)

  files.forEach(function (file) {
    var newPath = path.join(pathString, file)
    if (fs.statSync(newPath).isDirectory()) {
      filelist = _this.readFileList(newPath, filelist)
    } else {
      filelist.push(file)
    }
  })
  return filelist
}

module.exports.extension = function (file) {
  var array = file.split('.')
  return array[array.length - 1]
}

module.exports.uniqFileExtensions = function (pathString) {
  if (this.isFile(pathString)) {
    return [this.extension(pathString)]
  } else {
    var _this = this
    var extensions = []

    var fileList = this.readFileList(pathString)
    fileList.forEach(function (file) {
      var extension = _this.extension(file)
      if (extensions.indexOf(extension) === -1) {
        extensions.push(extension)
      }
    })
    return extensions
  }
}
