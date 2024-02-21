import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const updateProfile = async (req, res, next) => {
  try {
    const schemaUpdateProfile = Joi.object({
      name: Joi.string().min(3).max(33).trim().strict(),
      email: Joi.string().email(),
      phone: Joi.string().regex(/^[0-9]{10}$/),
      address: Joi.string(),
      birthday: Joi.date(),
      gender: Joi.string().valid('male', 'female', 'none'),
      avatar: Joi.string(),
      PIN: Joi.number()
    })
    await schemaUpdateProfile.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

const changePassword = async (req, res, next) => {
  try {
    const schemaChangePassword = Joi.object({
      oldPassword: Joi.string().min(8).required(),
      newPassword: Joi.string().min(8).required()
    })
    await schemaChangePassword.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

export const UserValidations = {
  updateProfile,
  changePassword
}