const Cleaner = jest.fn()
Cleaner.run = jest.fn()

Cleaner.mockReturnValue({
  run: Cleaner.run
})

export default Cleaner
