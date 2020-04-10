import path from 'path'
import { readdirSync } from 'fs'
import { copy } from 'fs-extra'

export const buildHTML = (inputDir, outputDir) => {
  Promise.all(
    readdirSync(inputDir).map((file) => {
      if (file.match(/\.html$/)) {
        return copyHTMLFile(path.join(inputDir, file), path.join(outputDir, file))
      }
    })
  )
}

export const copyHTMLFile = (input, output) => {
  return new Promise((resolve, reject) => {
    copy(input, output, (error) => {
      if (error) {
        return reject(error)
      } else {
        return resolve(null)
      }
    })
  })
}
