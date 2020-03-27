const stats = {
  compilation: {
    warnings: []
  },
  hasErrors: () => false
}
const webpack = jest.fn((_, fn) => {
  fn(null, stats)
})
export default webpack
