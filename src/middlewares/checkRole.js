import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

import { UserModels } from 'models/user.model'

async function checkRole(req, res, next) {
  try {
    const user = await UserModels.findOneById(req.user._id)

    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    const isAdmin = user.role === 'admin'
    if (isAdmin) {
      next()
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You are not allowed to access this resource' })
    }
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not allowed to access this resource')
  }

}

module.exports = checkRole