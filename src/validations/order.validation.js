import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const createOrderValidation = async (req, res, next) => {
  try {
    // xem example OrderData ở payments/paypal.api.js
    const schemaCreateOrder = Joi.object({
      intent: Joi.string().valid('CAPTURE', 'AUTHORIZE').required(),
      purchase_units: Joi.array().items(Joi.object({
        items: Joi.array().items(Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          unit_amount: Joi.object({
            currency_code: Joi.string().required(),
            value: Joi.string().required()
          }).required(),
          quantity: Joi.string().required()
        })).required(),
        amount: Joi.object({
          currency_code: Joi.string().required(),
          value: Joi.string().required(),
          breakdown: Joi.object({
            item_total: Joi.object({
              currency_code: Joi.string().required(),
              value: Joi.string().required()
            }).required()
          }).required()
        }).required()
      })).required(),
      application_context: Joi.object({
        return_url: Joi.string().required(),
        cancel_url: Joi.string().required()
      }).required()
    })

    await schemaCreateOrder.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const OrderValidations = {
  createOrderValidation
}