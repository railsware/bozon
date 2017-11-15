# bozon
> Scaffold, Run, Test and Package [Electron](http://electron.atom.io/) application with ease

[![npm version](https://badge.fury.io/js/bozon.svg)](https://badge.fury.io/js/bozon)
![img](https://circleci.com/gh/railsware/bozon.svg?style=shield&circle-token=73a7ce20fc55a51d77657e11c3f5c9d4bf5fdcd9)

## What is Bozon?
Bozon is a single tool for handling different tasks being performed by multiple packages, which is used for building desktop applications with Electron. Simplify building, compiling, running, testing, and packaging your application.

* **Electron** - build cross platform desktop apps with web technologies
* **Gulp** - task runner that helps making all important processes with a single command
* **Webpack** - building and packaging source code for renderer process done with webpack
* **spectron** - Easily test your Electron apps using ChromeDriver and WebdriverIO
* **electron-builder** - package and distribute your Electron app

![img](https://api.monosnap.com/rpc/file/download?id=KB5BGmknhLmuE38DGEXCFu4rbpBUzr)

## Installation

 
```bash
npm install -g bozon
```

Bozon tool should be installed globally in order to be used for all your electron apps.

## Scaffolding

Then generate your new project:

```bash
bozon new [name]
```
This will create a new directory `[name]` produce the following file structure:

  * Use `--skip-install` option if you want to skip running `npm install`

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

### Configuration
Bozon provides a way to define environment specific and platform specific configuration options. These multiple config files are being merged into one single `settings` object during build. This `settings` object is being written into `package.json` file of your application, so that you can use it in your code.
```
  |--config/
  |  |--settings.json
  |  |--environments/
  |  |  |--development.json
  |  |  |--production.json
  |  |  |--test.json
  |  |--platforms/
  |  |  |--mac.json
  |  |  |--linux.json
  |  |  |--windows.json
```

## Testing
Bozon is using [spectron](https://github.com/electron/spectron) and [mocha](https://mochajs.org/) spec runner for testing Electron applications. Both unit and integration tests should go to `./specs` directory. Simply execute for running tests:

```bash
bozon test
```

## Packaging application
Packaging Electron application is done by [electron-builder](https://www.npmjs.com/package/electron-builder) using settings in defined in `package.json` under `build` section.
Application source code is being compiled to `./builds/production/` directory, and packaged versions for different platforms go to `./packages` directory.

```bash
bozon package [mac|windows|linux]
```

## License

MIT © Alex Chaplinsky
