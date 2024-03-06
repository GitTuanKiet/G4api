import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const createCinemaValidation = async (req, res, next) => {
  try {
    const schemaCreateCinema = Joi.object({
      name: Joi.string().required(),
      city: Joi.string().required(),
      type: Joi.string().valid('2D', '3D', '4D').required(),
      roomMap: Joi.array().items(Joi.object({
        chair: Joi.string().required(),
        type: Joi.string().valid('normal', 'vip', 'couple', 'disable').required()
      })).required()
    })
    await schemaCreateCinema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateCinemaValidation = async (req, res, next) => {
  try {
    const schemaUpdateCinema = Joi.object({
      name: Joi.string(),
      city: Joi.string(),
      type: Joi.string().valid('2D', '3D', '4D'),
      roomMap: Joi.array().items(Joi.object({
        chair: Joi.string(),
        type: Joi.string().valid('normal', 'vip', 'couple', 'disable')
      }))
    })
    await schemaUpdateCinema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const CinemaValidations = {
  createCinemaValidation,
  updateCinemaValidation
}