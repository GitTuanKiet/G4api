import { StatusCodes } from 'http-status-codes'
import { isProduction } from 'utils/constants'
// error handler middleware để bắt lỗi, sửa lại response trả về cho client

const isProd = isProduction()

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {

  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  const responseError = {
    message: err.message || StatusCodes[err.statusCode],
    status: err.statusCode,
    stack: err.stack
  }

  if (isProd) delete responseError.stack

  res.status(err.statusCode).json(responseError)
}

module.exports = errorHandler