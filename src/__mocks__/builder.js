const Builder = jest.fn()
let buildError

Builder.__setBuildError = message => {
  buildError = message
}

Builder.run = jest.fn(() => {
  if (buildError) {
    return Promise.reject(Error(buildError))
  }
  return Promise.resolve()
})

Builder.mockReturnValue({
  run: Builder.run
})

export default Builder
