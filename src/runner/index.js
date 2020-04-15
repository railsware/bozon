import Generator from 'generator'
import { Starter } from 'starter'
import Packager from 'packager'
import { TestRunner } from 'test_runner'
import { Cleaner } from 'cleaner'
import { restoreCursorOnExit } from 'utils'

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
  Starter.run(params)
}

export const pack = (platform, command) => {
  restoreCursorOnExit()
  new Packager(platform, 'production', !!command.publish).build()
}

export const test = (path) => {
  restoreCursorOnExit()
  TestRunner.run(path)
}

export const clear = () => {
  restoreCursorOnExit()
  Cleaner.run()
}
