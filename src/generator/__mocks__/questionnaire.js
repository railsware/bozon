const Questionnaire = jest.fn()
Questionnaire.prompt = jest.fn(fn => {
  fn({ name: 'myapp', author: 'John Doe' })
})

Questionnaire.mockReturnValue({
  prompt: Questionnaire.prompt
})

export default Questionnaire
