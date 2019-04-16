const { series } = require('gulp')
const { html, images, styles, main, renderer, bundle } = require('./build.js')

module.exports = {
  build: series(html, images, styles, main, renderer, bundle),
  watch: require('./watch.js')
}
