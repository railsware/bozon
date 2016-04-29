Application = require('spectron').Application
assert = require('assert')

describe 'application launch', ->
  this.timeout(10000)

  beforeEach ->
    this.app = new Application
      path: './tmp/Testapp-darwin-x64/Testapp.app/Contents/MacOS/Testapp'
    this.app.start()

  afterEach ->
    if this.app && this.app.isRunning()
      return this.app.stop()

  it 'shows an initial window', ->
    this.app.client.getWindowCount().then (count) ->
      assert.equal(count, 1)
