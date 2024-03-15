import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import ApiError from 'utils/ApiError'

const createTheaterValidation = async (req, res, next) => {
  try {
    const schemaCreateTheater = Joi.object({
      name: Joi.string().required(),
      cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
      type: Joi.string().valid('2D', '3D', '4D').required(),
      roomMap: Joi.array().items(Joi.object({
        chair: Joi.string().required(),
        type: Joi.string().valid('normal', 'vip', 'couple', 'disable').required()
      })).required()
    })
    await schemaCreateTheater.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateTheaterValidation = async (req, res, next) => {
  try {
    const schemaUpdateTheater = Joi.object({
      name: Joi.string(),
      cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE),
      type: Joi.string().valid('2D', '3D', '4D'),
      roomMap: Joi.array().items(Joi.object({
        chair: Joi.string(),
        type: Joi.string().valid('normal', 'vip', 'couple', 'disable')
      }))
    })
    await schemaUpdateTheater.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const TheaterValidations = {
  createTheaterValidation,
  updateTheaterValidation
}