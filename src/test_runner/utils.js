import fs from 'fs'
import path from 'path'

const isFile = function (pathString) {
  return fs.lstatSync(pathString).isFile()
}

const readFileList = function (pathString, filelist) {
  let list = filelist || []

  const files = fs.readdirSync(pathString)

  files.forEach(function (file) {
    const newPath = path.join(pathString, file)
    if (fs.statSync(newPath).isDirectory()) {
      list = readFileList(newPath, filelist)
    } else {
      list.push(file)
    }
  })
  return list
}

const extension = function (file) {
  const array = file.split('.')
  return array[array.length - 1]
}

export const uniqFileExtensions = function (pathString) {
  if (isFile(pathString)) {
    return [extension(pathString)]
  } else {
    const extensions = []

    const fileList = readFileList(pathString)
    fileList.forEach(function (file) {
      const ext = extension(file)
      if (extensions.indexOf(ext) === -1) {
        extensions.push(ext)
      }
    })
    return extensions
  }
}
