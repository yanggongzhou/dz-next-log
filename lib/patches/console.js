const logger = require('../logger')

const getPinoMethod = consoleMethod => {
  switch (consoleMethod) {
    case 'error':
      return logger.error;
    case 'warn':
      return logger.warn;
    case 'info':
      return logger.info;
    default:
      return logger.info;
  }
}

const consoleMethods = ['log', 'debug', 'info', 'warn', 'error']
consoleMethods.forEach(method => {
  // eslint-disable-next-line no-console
  console[method] = getPinoMethod(method)
})
