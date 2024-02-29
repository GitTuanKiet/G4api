import { StatusCodes } from 'http-status-codes'
import { UserServices } from 'services/user.service'

const uploadAvatar = async (req, res) => {
  try {
    const { _id } = req.user
    const token = await UserServices.updateProfile(_id, req.body)

    return res.status(StatusCodes.OK).json({ token })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

export const UploadControllers = {
  uploadAvatar
}