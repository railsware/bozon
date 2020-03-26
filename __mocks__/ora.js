const start = jest.fn()
const succeed = jest.fn()

const ora = jest.fn(() => {
  return {
    start: start,
    succeed: succeed
  }
})
ora.start = start
ora.succeed = succeed

export default ora
