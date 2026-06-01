const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('../errors')

const errorHandler = (err, req, res, next) => {
  if(err instanceof CustomError) {
    const body = { message: err.message, success: 'failed' }
    if (err.field) body.field = err.field
    return res.status(err.statusCode).json(body)
  }

  console.error('[500 Internal Error]', err)

  const body = { message: 'Internal Server Error', success: 'failed' }
  if (process.env.NODE_ENV !== 'production') {
    body.error = err.message
    body.stack = err.stack
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(body)
}

module.exports = errorHandler