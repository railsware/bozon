path = require('path')
gulp = require('gulp')
shell = require('shelljs')
argv = require('yargs').argv
utils = require('./utils/utils')

env = argv.env || 'production'

buildPath = (os) ->
  utils.destination env, os

cmdPackage = (params, platform) ->
  os = platform.split('-')[0]
  arch = platform.split('-')[1]
  command = "./node_modules/.bin/electron-packager #{buildPath(os)} #{utils.settings().name} --platform=#{os}  --arch=#{arch} --out=#{params.destination} --icon=#{params.platformResources[os].icon}"
  command += ' --overwrite' if params.overwrite
  command += ' --asar' if params.archive
  command

gulp.task 'packager:run', ->
  for platform in utils.settings().packaging.platforms
    shell.exec cmdPackage(utils.settings().packaging, platform), (error, stdout, stderr) ->
      console.log(stdout)

gulp.task 'package', ['build:production', 'packager:run']
