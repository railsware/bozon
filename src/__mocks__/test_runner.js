const TestRunner = jest.fn()
TestRunner.run = jest.fn().mockResolvedValue(true)

TestRunner.mockReturnValue({
  run: TestRunner.run
})

export default TestRunner
