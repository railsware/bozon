let testError = null

export const TestRunner = {
  __setError: error => {
    testError = error
  },
  run: jest.fn(() => {
    if (testError) {
      return Promise.reject(testError)
    } else {
      return Promise.resolve()
    }
  })
}
