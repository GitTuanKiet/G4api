import { StatusCodes } from 'http-status-codes'
import { AuthServices } from 'services/auth.service.js'

const loginController = async (req, res, next) => {
  try {
    const token = await AuthServices.loginService(req.body)

    return res.status(StatusCodes.OK).json(token)
  } catch (error) {
    next(error)
  }
}

const registerController = async (req, res, next) => {
  try {
    const user = await AuthServices.registerService(req.body)

    return res.status(StatusCodes.CREATED).json(user)
  } catch (error) {
    next(error)
  }
}


export const AuthControllers = {
  loginController,
  registerController
}