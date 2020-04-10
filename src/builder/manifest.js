import { readFileSync, writeFile } from 'fs'

export const buildManifest = (source, destination) => {
  return new Promise((resolve, reject) => {
    const json = JSON.parse(readFileSync(source))
    const settings = {
      name: json.name,
      version: json.version,
      description: json.description,
      author: json.author || 'Anonymous',
      main: 'main/index.js',
      repository: json.repository
    }
    writeFile(destination, JSON.stringify(settings), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(null)
      }
    })
  })
}
