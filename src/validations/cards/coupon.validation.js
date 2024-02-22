import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const registerCoupon = async (req, res, next) => {
  try {
    const schemaRegisterCoupon = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      discount: Joi.number().valid(5, 10, 15, 20, 25, 30, 35, 40, 45, 50).required()
    })

    await schemaRegisterCoupon.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const CouponValidations = {
  registerCoupon
}