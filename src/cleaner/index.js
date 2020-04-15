import path from 'path'
import { emptyDir } from 'fs-extra'
import { startSpinner, stopSpinner } from 'utils/logger'

const DIRECTORIES = ['builds', 'packages', '.tmp']

const run = async () => {
  startSpinner('Cleaning app directory')
  await Promise.all(DIRECTORIES.map((dir) => clearDir(dir)))
  stopSpinner('Cleaned app directory')
}

const clearDir = (dir) => {
  return emptyDir(path.join(process.cwd(), dir))
}

export const Cleaner = { run }
