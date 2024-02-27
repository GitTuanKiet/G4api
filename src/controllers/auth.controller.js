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

const forgotPasswordController = async (req, res, next) => {
  try {
    await AuthServices.forgotPasswordService(req.body)

    return res.status(StatusCodes.OK).json({ message: 'Please check your email to reset password' })
  } catch (error) {
    next(error)
  }
}

const resetPasswordController = async (req, res, next) => {
  try {
    await AuthServices.resetPasswordService(req.params.token)

    return res.status(StatusCodes.OK).json({ message: 'Reset password successfully' })
  } catch (error) {
    next(error)
  }
}

const refreshTokenController = async (req, res, next) => {
  try {
    const token = await AuthServices.refreshTokenService(req.body)

    return res.status(StatusCodes.OK).json(token)
  } catch (error) {
    next(error)
  }
}


export const AuthControllers = {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController
}