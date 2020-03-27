const copy = jest.fn((_, out, fn) => {
  fn(null)
})

export default copy
