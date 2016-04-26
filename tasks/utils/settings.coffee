os = require 'os'
path = require 'path'
Config = require 'merge-config'
argv = require('yargs').argv

class Settings

  constructor: (@environment = 'development', @curerntPlatform = false) ->
    @config = new Config()
    @config.file path.join 'config', 'settings.json'
    @config.file path.join 'config', 'environments', "#{@env()}.json"
    @config.file path.join 'config', 'platforms', "#{@platform()}.json"

  env: ->
    argv.env || @environment

  platform: ->
    @curerntPlatform || os.platform()

  get: (key = '') ->
    @config.get(key)

module.exports = Settings
