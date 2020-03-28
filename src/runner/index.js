import Generator from 'generator'
import Starter from 'starter'
import Packager from 'packager'
import TestRunner from 'test_runner'

export const create = (name, command) => {
  const options = { skipInstall: !!command.skipInstall }
  new Generator(name, options).generate()
}

export const start = command => {
  let options
  if (command.inspect) {
    options = ['--inspect=' + command.inspect]
  } else if (command.inspectBrk) {
    options = ['--inspect-brk=' + command.inspectBrk]
  } else {
    options = []
  }
  new Starter(options).run()
}

export const pack = (platform, command) => {
  new Packager(platform, 'production', !!command.publish).build()
}

export const test = (path, command) => {
  const options = {
    path: path,
    timeout: command.timeout
  }
  new TestRunner(options).run().then(() => {
    process.exit(0)
  })
}
