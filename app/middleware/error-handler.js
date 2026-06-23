const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('../errors')
const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  const ctx = { method: req.method, url: req.originalUrl, ip: req.ip }

  if(err instanceof CustomError) {
    logger.warn('errorHandler', `${err.statusCode} ${err.message}`, ctx)
    const body = { message: err.message, success: 'failed' }
    if (err.field) body.field = err.field
    return res.status(err.statusCode).json(body)
  }

  logger.error('errorHandler', `500 ${err.message}`, { ...ctx, stack: err.stack })

  const body = { message: 'Internal Server Error', success: 'failed' }
  if (process.env.NODE_ENV !== 'production') {
    body.error = err.message
    body.stack = err.stack
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(body)
}

module.exports = errorHandler