# bozon ![img](https://circleci.com/gh/railsware/bozon.svg?style=shield&circle-token=73a7ce20fc55a51d77657e11c3f5c9d4bf5fdcd9)
> Bootstrap, Build, Run and Package [Electron](http://electron.atom.io/) application with ease

## What is Bozon?
Bozon is a single tool for handling different tasks being performed by multiple packages, which is used for building desktop applications with Electron. Simplify building, compiling, running, testing, and packaging your application.

* **Electron** - build cross platform desktop apps with web technologies
* **Gulp** - task runner that helps making all important processes with a single command
* **Webpack** - building and packaging source code for renderer process done with webpack
* **spectron** - Easily test your Electron apps using ChromeDriver and WebdriverIO
* **electron-packager** - package and distribute your Electron app

![img](https://api.monosnap.com/rpc/file/download?id=OrfGcc5KS0miV3RWGB92Wgl7HKOjFO)

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
  |  |  |--renderer/
  |  |  |--main/
  |  |--stylesheets/
  |  |--index.html
  |  |--package.json
  |--config/
  |--spec/
  |--gulpfile.js
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
