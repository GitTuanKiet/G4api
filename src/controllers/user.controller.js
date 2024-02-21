import { StatusCodes } from 'http-status-codes'
import { UserServices } from 'services/user.service'


const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user
    const data = req.body
    const user = await UserServices.updateProfile(userId, data)
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const changePassword = async (req, res) => {
  try {
    const { userId } = req.user
    const data = req.body
    const user = await UserServices.changePassword(userId, data)
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}


export const UserControllers = {
  updateProfile,
  changePassword
}