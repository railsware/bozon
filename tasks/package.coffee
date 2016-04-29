path = require('path')
gulp = require('gulp')
childProcess = require('child_process')
argv = require('yargs').argv
utils = require('./utils/utils')

env = argv.env || 'production'

testOptions = ->
  [
    './builds/test',
    utils.settings().name,
    "--platform=#{process.platform}",
    "--arch=#{process.arch}",
    "--icon=#{utils.settings().packaging.platformResources?[process.platform]?.icon}",
    "--out=.tmp",
    "--overwrite"
  ]

productionOptions = (os, arch) ->
  args = [
    utils.destination(env, os),
    utils.settings().name,
    "--platform=#{os}",
    "--arch=#{arch}",
    "--out=#{utils.release(env, os)}",
    "--icon=#{params.platformResources[os].icon}"
  ]
  args.push '--overwrite' if params.overwrite
  args.push '--asar' if params.archive
  args

gulp.task 'package', ->
  for platform in utils.settings().packaging.platforms
    os = platform.split('-')[0]
    arch = platform.split('-')[1]
    childProcess.spawnSync 'gulp', ['compile', "--env=#{env}", "--platform=#{os}"], stdio: 'inherit'
    childProcess.spawnSync './node_modules/.bin/electron-packager', productionOptions(os, arch), stdio: 'inherit'

gulp.task 'package:test', ['build:test'], ->
  childProcess.spawnSync './node_modules/.bin/electron-packager', testOptions(), stdio: 'inherit'
