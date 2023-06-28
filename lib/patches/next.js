const nextLogger = require('next/dist/build/output/log')

const logger = require('../logger')

const getPinoMethod = nextMethod => {

  switch (nextMethod) {
    case 'error':
      return logger.error;
    case 'warn':
      return logger.warn;
    case 'trace':
      return logger.info;
    default:
      return logger.info;
  }
}

Object.keys(nextLogger.prefixes).forEach(method => {
  nextLogger[method] = getPinoMethod(method)
})
