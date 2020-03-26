import fs from 'fs'
import webpack from 'webpack'
import bozon from 'utils/bozon'
import mainDefault from './main'
import rendererDefault from './renderer'
import preloadDefault from './preload'

export default class WebpackConfig {
  constructor(env, platform) {
    this.env = env;
    this.platform = platform;
    this.rendererDefault = rendererDefault(this.mode(), this.env);
    this.mainDefault = mainDefault(this.mode(), this.env);
    this.preloadDefault = preloadDefault(this.mode(), this.env);
    this.localConfig();
  }

  build() {
    const configs = {
      renderer: Object.assign({}, this.rendererDefault, this.config.renderer),
      main: Object.assign({}, this.mainDefault, this.config.main)
    };
    if (this.config.preload) {
      configs.preload = Object.assign(
        {},
        this.preloadDefault,
        this.config.preload
      );
    }
    configs.main.plugins.push(
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(this.settings())
      })
    );
    return configs;
  }

  mode() {
    return this.env === 'test' ? 'development' : this.env;
  }

  settings() {
    const json = JSON.parse(fs.readFileSync(bozon.source('package.json')));
    const settings = bozon.config(this.env, this.platform);
    settings.name = json.name;
    settings.version = json.version;
    return settings;
  }

  localConfig() {
    const configFile = bozon.source('webpack.config.js');
    // eslint-disable-next-line no-eval
    this.config = fs.existsSync(configFile) ? eval(fs.readFileSync(configFile).toString()) : {};
  }
}
