stats =
  hasErrors: ->
    false
  compilation:
    warnings: []
webpack = sinon.stub().callsArgWith(1, null, stats)
webpack.DefinePlugin = sinon.spy()

module.exports = webpack
