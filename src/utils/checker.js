import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const ensureFilesPresence = () => {
  ['package.json'].forEach((file) => {
    try {
      fs.lstatSync(path.join(process.cwd(), file))
    } catch (e) {
      log('\n  Could not find ' +
        chalk.yellow(file) +
        ".. It doesn't look like you are in electron app root directory.\n")
    }
  })
}

const ensureDependencies = () => {
  try {
    fs.lstatSync(path.join(process.cwd(), 'node_modules'))
  } catch (e) {
    log('\n  Run ' + chalk.cyan('npm install') + '.. \n')
  }
}

const log = (error) => {
  console.log(error)
  process.exit()
}

const ensure = () => {
  ensureFilesPresence()
  ensureDependencies()
}

export default { ensure }
