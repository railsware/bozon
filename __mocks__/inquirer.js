const prompt = jest.fn().mockResolvedValue({
  name: 'myapp', author: 'John Doe'
})

export default { prompt }
