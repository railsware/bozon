path = require 'path'


module.exports.destination = (env, platform, suffix = '') ->
  if env is 'test' or env is 'development'
    path.join 'builds', env, suffix
  else
    path.join 'builds', env, platform, suffix

module.exports.source = (suffix) ->
  path.join 'app', suffix

module.exports.settings = ->
  require(path.join(process.cwd(), 'package.json'))
