const Packager = jest.fn()
Packager.build = jest.fn().mockResolvedValue(true)

Packager.mockReturnValue({
  build: Packager.build
})

export default Packager
