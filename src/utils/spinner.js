import chalk from 'chalk'
import readline from 'readline'

const FRAMES = [
  '⣾',
  '⣽',
  '⣻',
  '⢿',
  '⡿',
  '⣟',
  '⣯',
  '⣷'
]
const INTERVAL = 50

export class Spinner {
  start(message) {
    process.stdout.write('\x1B[?25l')
    let i = 0
    this.interval = setInterval(() => {
      const frame = FRAMES[i]
      process.stdout.write(`${message} ${chalk.cyan(frame)}`)
      readline.cursorTo(process.stdout, 0)
      i = i === FRAMES.length - 1 ? 0 : i + 1
    }, INTERVAL)
  }

  stop(message) {
    clearInterval(this.interval)
    readline.clearLine(process.stdout)
    process.stdout.write(`${message}`)
  }
}
