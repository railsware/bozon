import Generator from '../scaffolding/generator';
import Starter from '../starting/starter';
import Packager from '../packaging/packager';
import Cleaner from '../clearing/cleaner';
import TestRunner from '../testing/test_runner';

export const create = (name, options) => {
  new Generator(name, options).generate();
};

export const start = options => {
  new Starter(options).run();
};

export const clear = () => {
  new Cleaner().run();
};

export const pack = (platform, publish = false) => {
  new Packager(platform, 'production', publish).build();
};

export const test = options => {
  return new TestRunner(options).run();
};

export const run = () => {
  console.log('run');
};
