import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

function checkRole (req, res, next) {
  if (req.user.role === 'admin') {
    next()
  } else {
    res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to access this resource'))
  }
}

module.exports = checkRole