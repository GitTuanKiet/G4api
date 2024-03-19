import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

function checkRole(req, res, next) {
  const isAdmin = req.user.role === 'admin'
  if (isAdmin) {
    next()
  } else {
    res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to access this resource'))
  }
}

module.exports = checkRole