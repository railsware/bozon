const WebpackConfig = jest.fn()
WebpackConfig.build = jest.fn(() => {
  return {
    renderer: {
      target: 'electron-renderer'
    },
    main: {
      target: 'electron-main'
    },
    preload: {
      target: 'electron-preload'
    }
  }
})

WebpackConfig.mockReturnValue({
  build: WebpackConfig.build
})

export default WebpackConfig
