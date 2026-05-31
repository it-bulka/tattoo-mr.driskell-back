const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('../errors')

const errorHandler = (err, req, res, next) => {
  if(err instanceof CustomError) {
    const body = { message: err.message, success: 'failed' }
    if (err.field) body.field = err.field
    return res.status(err.statusCode).json(body)
  }
  console.log({err})
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: 'failed' })
}

module.exports = errorHandler