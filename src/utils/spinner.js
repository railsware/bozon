import chalk from 'chalk'

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
      process.stdout.cursorTo(0)
      i = i === FRAMES.length - 1 ? 0 : i + 1
    }, INTERVAL)
  }

  stop(message) {
    clearInterval(this.interval)
    process.stdout.clearLine()
    process.stdout.write(`${message}`)
  }
}
