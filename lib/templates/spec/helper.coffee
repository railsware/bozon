path = require('path')

module.exports =
  appPath: ->
    switch process.platform
      when 'darwin'
        path.join(__dirname, '..', '.tmp', "<%= name%>-#{process.platform}-#{process.arch}", '<%= name%>.app', 'Contents', 'MacOS', '<%= name%>')
      when 'linux'
        path.join(__dirname, '..', '.tmp', "<%= name%>-#{process.platform}-#{process.arch}", '<%= name%>')
      else
        throw 'Unsupported platform'
