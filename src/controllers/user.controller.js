import { StatusCodes } from 'http-status-codes'
import { UserServices } from 'services/user.service'


const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user
    const data = req.body
    const user = await UserServices.updateProfile(_id, data)
    delete user.password

    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const changePassword = async (req, res) => {
  try {
    const { _id } = req.user
    const data = req.body
    await UserServices.changePassword(_id, data)
    return res.status(StatusCodes.OK).json({ message: 'Change password successfully' })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}


export const UserControllers = {
  updateProfile,
  changePassword
}