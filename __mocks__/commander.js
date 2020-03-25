function Commander() {
  Commander.prototype.version = jest.fn().mockReturnValue(this)
  Commander.prototype.usage = jest.fn().mockReturnValue(this)
  Commander.prototype.command = jest.fn().mockReturnValue(this)
  Commander.prototype.action = jest.fn().mockReturnValue(this)
  Commander.prototype.description = jest.fn().mockReturnValue(this)
  Commander.prototype.option = jest.fn().mockReturnValue(this)
  Commander.prototype.alias = jest.fn().mockReturnValue(this)
  Commander.prototype.parse = jest.fn().mockReturnValue(this)
  Commander.prototype.outputHelp = jest.fn().mockReturnValue(this)
}
const commander = new Commander()

export default commander
