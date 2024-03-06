import Joi from 'joi'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { StatusCodes } from 'http-status-codes'
import ApiError from 'utils/ApiError'

const createShowtimeValidation = async (req, res, next) => {
  try {
    const schemaCreateShowtime = Joi.object({
      movieId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
      cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
      day: Joi.date().required(),
      start: Joi.number().min(7).max(20).required(),
      price: Joi.number().required()
    })
    await schemaCreateShowtime.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateShowtimeValidation = async (req, res, next) => {
  try {
    const schemaUpdateShowtime = Joi.object({
      movieId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE),
      cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE),
      day: Joi.date(),
      start: Joi.number().min(7).max(20).required(),
      price: Joi.number()
    })
    await schemaUpdateShowtime.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const ShowtimeValidations = {
  createShowtimeValidation,
  updateShowtimeValidation
}