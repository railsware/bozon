import webpack from 'webpack'

export const bundle = (config) => {
  return new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error || stats.hasErrors()) {
        return reject(error || stats.compilation.errors)
      }
      const { compilation: { warnings } } = stats
      return resolve(warnings.length > 0 ? warnings.join() : null)
    })
  })
}
