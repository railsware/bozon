path = require('path')
fs = require('fs')

module.exports =
  fileExists: (file) ->
    filePath = path.join(process.cwd(), 'test_app', file)
    try
      fs.statSync(filePath)
      true
    catch error
      console.error("  no such file or directory #{error.path}")
      false

  fileContains: (file, string) ->
    filePath = path.join(process.cwd(), 'test_app', file)
    contents = fs.readFileSync(filePath, 'utf8')
    regexp = new RegExp(string, 'g')
    contents.match(regexp) isnt null
