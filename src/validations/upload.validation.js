import Joi from 'joi'
import path from 'path'
import { StatusCodes } from 'http-status-codes'
import { UPLOAD_REGEX } from 'utils/constants'
import ApiError from 'utils/ApiError'

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

export const UploadValidations = {
  uploadAvatar
}