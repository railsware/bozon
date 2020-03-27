process.cwd = jest.fn().mockReturnValue('/test/home')
Object.defineProperty(process, 'platform', {
  get: () => 'linux',
  set: jest.fn()
})
