# bozon
> Bootstrap, Build, Run and Package [Electron](http://electron.atom.io/) application with ease. CoffeeScript and Sass included.


## Installation


```bash
npm install -g bozon
```

Then generate your new project:

```bash
bozon new [name]
```
This will produce the following file structure:

```
  |--app/
  |  |--images/
  |  |--javascripts/
  |  |  |--browser/
  |  |  |--main/
  |  |--stylesheets/
  |  |--index.html
  |  |--package.json
  |--config/
  |--spec/
  |--gulpfile.coffee
  |--package.json
```

## Starting an application

```bash
bozon start
```

This will compile Application source code to `./builds/development` directory and run your application from it.

## Testing
Bozon is using [spectron](https://github.com/electron/spectron) and [mocha](https://mochajs.org/) spec runner for testing Electron applications. Both unit and integration tests should go to `./specs` directory. Simply execute for running tests:

```bash
bozon test
```

## Packaging application
Packaging Electron application is done by [electron-packager](https://www.npmjs.com/package/electron-packager) using settings in defined in `package.json` under `packaging` section.
Application source code is being compiled to `./builds/production/[platform]` directory, and packaged versions for different platforms go to `./packages` directory.

```bash
bozon package
```

## License

MIT © Alex Chaplinsky
