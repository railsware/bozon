const Packager = jest.fn()
Packager.build = jest.fn()

Packager.mockReturnValue({
  build: Packager.build
})

export default Packager
