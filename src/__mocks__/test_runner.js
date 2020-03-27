const TestRunner = jest.fn()
TestRunner.run = jest.fn()

TestRunner.mockReturnValue({
  run: TestRunner.run
})

export default TestRunner
