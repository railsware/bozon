# bozon
> Command line tool for building, testing and publishing modern [Electron](http://electron.atom.io/) applications

[![npm version](https://badge.fury.io/js/bozon.svg)](https://badge.fury.io/js/bozon)
[![Actions Status](https://github.com/railsware/bozon/workflows/Node.js%20CI/badge.svg)](https://github.com/swiftyapp/swifty/actions)

Bozon is  a simple, easy to use tool that unifies the existing build tools for Electron development. Simplify building, compiling, running, testing, and packaging your Electron applications.


## Features
* **Scaffolding** - Generate ready to use project structure for your new Electron application.
* **Running** - Run your electron application with **Hot Reload** in development environment.
* **Testing** - Build Application for test env and run feature tests for your Electron application.
* **Packaging** - Build, package and publish your Electron app for Mac, Windows and Linux platforms.

Bozon uses [Webpack](https://webpack.js.org) to bundle source code for **main** and **renderer** processes as well as **preload** script. It adds **webpack.config.js** file to your project so that you can further configure webpack, add new rules, loaders etc. [Jest](https://jestjs.io/) along with [Spectron](https://www.electronjs.org/spectron) are used to run your **unit** and **feature tests** within real Electron application. For **packaging** and **publishing** applications bozon uses [electron-builder](https://www.electron.build/) under the hood.

![bozon_start](https://user-images.githubusercontent.com/695947/152010984-8599ae9d-5c5c-40ec-90c5-b2a6e4d07052.png)

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
  |--config/
  |--resources/
  |--src/
  |  |--main/
  |  |  |--index.js
  |  |--preload/
  |  |  |--index.js
  |  |--renderer/git 
  |  |  |--index.html
  |  |  |--images/
  |  |  |--stylesheets/
  |  |  |--javascripts/
  |  |  |  |--index.js
  |--test/
  |--package.json
```

## Starting an application

```bash
bozon start
```

This will compile Application source code to `./builds/development` directory and run your application from it.

### Configuration
Bozon provides a way to define environment specific and platform specific configuration options. These multiple config files are being merged into one single `config` object during build. This `config` object is accessible via `CONFIG` variable in `main` process files of your application, so that you can use it in your code.
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
Bozon is using [Jest](https://jestjs.io/) and [Spectron](https://www.electronjs.org/spectron) for testing Electron applications. Both unit and integration tests should go to `./test` directory. Simply execute for running tests:

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
