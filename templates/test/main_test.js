describe('application launch', () => {
  beforeEach(() => app.start())

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  test('shows an initial window', async () => {
    const count = await app.client.getWindowCount()
    expect(count).toBe(1)
  })
})
