const Start = jest.fn()
Start.run = jest.fn()

Start.mockReturnValue({
  run: Start.run
})

export default Start
