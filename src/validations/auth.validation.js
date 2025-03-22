import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const loginValidation = async (req, res, next) => {
  try {
    const schemaLogin = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    })
    await schemaLogin.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const registerValidation = async (req, res, next) => {
  try {
    const schemaRegister = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      birthday: Joi.string().isoDate().required(),
      password: Joi.string().min(8).required()
    })
    await schemaRegister.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const forgotPasswordValidation = async (req, res, next) => {
  try {
    const schemaForgotPassword = Joi.object({
      email: Joi.string().email().required()
    })
    await schemaForgotPassword.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const AuthValidations = {
  loginValidation,
  registerValidation,
  forgotPasswordValidation
}