import Generator from 'generator'
import { Starter } from 'starter'
import Packager from 'packager'
import { TestRunner } from 'test_runner'
import { Cleaner } from 'cleaner'
import { restoreCursorOnExit, platform } from 'utils'

export const create = (name, command) => {
  const options = { skipInstall: !!command.skipInstall }
  new Generator(name, options).generate()
}

export const start = command => {
  restoreCursorOnExit()
  const params = {
    options: [],
    flags: {
      reload: !!command.reload
    }
  }
  if (command.inspect) {
    params.options = ['--inspect=' + command.inspect]
  } else if (command.inspectBrk) {
    params.options = ['--inspect-brk=' + command.inspectBrk]
  }
  return Starter.run(params)
}

export const build = (env) => {
  restoreCursorOnExit()
  return new Packager(platform(), env)
    .build()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export const pack = (platform, command) => {
  restoreCursorOnExit()
  return new Packager(platform, 'production', !!command.publish).build()
}

export const test = (path) => {
  restoreCursorOnExit()
  return TestRunner.run(path)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export const clear = () => {
  restoreCursorOnExit()
  return Cleaner.run()
}
