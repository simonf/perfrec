var winston = require('winston')

var console = new winston.transports.Console()
var file = new winston.transports.File({ filename: 'error.log' })

var logger = null

if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [ console ]
  })
} else if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
  logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [ console, file ]
  })
} else {
  logger = winston.createLogger({
    level: 'warn',
    format: winston.format.json(),
    transports: [ console, file ]
  })
}

module.exports = logger
