# bozon
> Bootstrap, Build, Run and Package Electron application with ease. CoffeeScript and Sass included.


## Installation


```bash
npm install -g bozon
```

Then generate your new project:

```bash
bozon new [name]
```

## Starting an application
Application source code will be compiled to `builds/development` directory and Electron will be run after that.

```bash
bozon start
```

## Packaging application
Application source code will be compiled to `builds/production/[platform]` directories. List of platforms is defined in `package.json` under `packaging` section.

```bash
bozon package
```

## License

MIT © [Alex Chaplinsky]()
