let buildError

export const Builder = {
  run: jest.fn(() => {
    if (buildError) {
      return Promise.reject(Error(buildError))
    }
    return Promise.resolve()
  }),
  __setBuildError: message => {
    buildError = message
  }
}
