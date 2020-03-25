const Generator = jest.fn()
Generator.generate = jest.fn()

Generator.mockReturnValue({
  generate: Generator.generate
})

export default Generator
