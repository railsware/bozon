import Generator from 'generator'
import Starter from 'starter'
import Packager from 'packager'
import TestRunner from 'test_runner'

export const create = (name, options) => new Generator(name, options).generate()

export const start = (options) => new Starter(options).run()

export const pack = (platform, publish = false) =>
  new Packager(platform, 'production', publish).build()

export const test = (options) => new TestRunner(options).run()
