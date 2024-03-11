import { StatusCodes } from 'http-status-codes'
import { UserServices } from 'services/user.service'
import { CardServices } from 'services/card.service'

const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user
    const data = req.body
    const accessToken = await UserServices.updateProfile(_id, data)

    return res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const { _id } = req.user
    const accessToken = await UserServices.updateProfile(_id, req.body)

    return res.status(StatusCodes.OK).json({ accessToken })
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

const SetupPIN = async (req, res) => {
  try {
    const { _id } = req.user
    const data = req.body
    await UserServices.SetupPIN(_id, data)
    return res.status(StatusCodes.OK).json({ message: 'Setup PIN successfully' })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const getHistory = async (req, res) => {
  try {
    const { _id } = req.user
    const data = await UserServices.getHistory(_id)

    return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const fetchAllByUserId = async (req, res, next) => {
  try {
    const { _id } = req.user
    const cards = await CardServices.fetchAllByUserId(_id)

    return res.status(StatusCodes.OK).json(cards)
  } catch (error) {
    next(error)
  }
}

export const UserControllers = {
  updateProfile,
  uploadAvatar,
  changePassword,
  SetupPIN,
  getHistory,
  fetchAllByUserId
}