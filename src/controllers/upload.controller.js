import { StatusCodes } from 'http-status-codes'
import { UserServices } from 'services/user.service'

const uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.user
    const user = await UserServices.updateProfile(userId, req.body)
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

export const UploadControllers = {
  uploadAvatar
}