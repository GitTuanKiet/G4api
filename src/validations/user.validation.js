import Joi from 'joi'
import path from 'path'

import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE, UPLOAD_REGEX } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const updateProfile = async (req, res, next) => {
  try {
    const schemaUpdateProfile = Joi.object({
      name: Joi.string().min(3).max(33).trim().strict(),
      email: Joi.string().email(),
      phone: Joi.string().regex(/^[0-9]{10}$/),
      address: Joi.string(),
      birthday: Joi.string().isoDate(),
      gender: Joi.string().valid('male', 'female', 'none'),
      PIN: Joi.number()
    })
    await schemaUpdateProfile.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

const uploadAvatar = async (req, res, next) => {
  // sửa field avatar thành đường dẫn file
  if (req.file) {
    req.body.avatar = path.join('/', req.file.path)
  }
  try {
    const schemaAvatar = Joi.object({
      avatar: Joi.string().pattern(UPLOAD_REGEX)
    })
    await schemaAvatar.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
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

const SetupPIN = async (req, res, next) => {
  try {
    const schemaSetupPIN = Joi.object({
      newPIN: Joi.number().min(6).required()
    })
    await schemaSetupPIN.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

const registerMemberCard = async (req, res, next) => {
  try {
    const schemaRegisterMemberCard = Joi.object({
      number: Joi.string().required(),
      pin: Joi.string().required(),
      registeredDate: Joi.string().isoDate().required()
    })
    await schemaRegisterMemberCard.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

export const UserValidations = {
  updateProfile,
  uploadAvatar,
  changePassword,
  SetupPIN,
  registerMemberCard
}