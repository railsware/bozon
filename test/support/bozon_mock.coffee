  module.exports =
    config: sinon.mock().returns({})
    log: sinon.spy()
    source: (segment) ->
      "#{process.cwd()}/test/assets/#{segment}"
    sourcePath: (segment) ->
      "#{process.cwd()}/test/assets/src/#{segment}"
    destinationPath: (segment, env) ->
      "#{process.cwd()}/test/assets/builds/#{env}/#{segment}"
    platform: ->
      'mac'
    runMocha: sinon.spy()
