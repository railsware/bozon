const start = jest.fn()
const succeed = jest.fn()
const fail = jest.fn()

const ora = jest.fn(() => {
  return {
    start: start,
    succeed: succeed,
    fail: fail
  }
})
ora.fail = fail
ora.start = start
ora.succeed = succeed

export default ora
