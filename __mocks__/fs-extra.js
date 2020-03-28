export const emptyDir = jest.fn()
export const copy = jest.fn((_, out, fn) => {
  fn(null)
})

export default { emptyDir, copy }
