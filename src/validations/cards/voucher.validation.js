import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const registerVoucher = async (req, res, next) => {
  try {
    const schemaRegisterVoucher = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().valid(100, 200, 300, 500, 1000).required()
    })

    await schemaRegisterVoucher.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const VoucherValidations = {
  registerVoucher
}