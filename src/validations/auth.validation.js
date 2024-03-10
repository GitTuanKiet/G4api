import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const loginValidation = async (req, res, next) => {
  try {
    const schemaLogin = Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required'
      }),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.empty': 'Password is required'
      })
    })
    await schemaLogin.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const registerValidation = async (req, res, next) => {
  try {
    const schemaRegister = Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required'
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required'
      }),
      birthday: Joi.string().isoDate().required().messages({
        'string.isoDate': 'Birthday must be a valid date',
        'string.empty': 'Birthday is required'
      }),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.empty': 'Password is required'
      })
    })
    await schemaRegister.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const forgotPasswordValidation = async (req, res, next) => {
  try {
    const schemaForgotPassword = Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required'
      })
    })
    await schemaForgotPassword.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
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