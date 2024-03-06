import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { UPLOAD_REGEX } from 'utils/constants'
import ApiError from 'utils/ApiError'
import path from 'path'

const createMovieValidation = async (req, res, next) => {
  if (req.file) {
    req.body.poster = path.join('/', req.file.path)
  }
  try {
    const schemaCreateMovie = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      ageRestriction: Joi.number().valid(0, 13, 16, 18).required(),
      duration: Joi.number().required(),
      releaseDate: Joi.date().required(),
      poster: Joi.string().pattern(UPLOAD_REGEX).required(),
      trailer: Joi.string().required(),
      language: Joi.string().required(),
      genres: Joi.array().items(Joi.string()).required(),
      actors: Joi.array().items(Joi.string()).required(),
      directors: Joi.array().items(Joi.string()).required()
    })
    await schemaCreateMovie.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateMovieValidation = async (req, res, next) => {
  if (req.file) {
    req.body.poster = path.join('/', req.file.path)
  }
  try {
    const schemaUpdateMovie = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      ageRestriction: Joi.number().valid(0, 13, 16, 18),
      duration: Joi.number(),
      releaseDate: Joi.date(),
      poster: Joi.string().pattern(UPLOAD_REGEX),
      trailer: Joi.string(),
      language: Joi.string(),
      genres: Joi.array().items(Joi.string()),
      actors: Joi.array().items(Joi.string()),
      directors: Joi.array().items(Joi.string())
    })
    await schemaUpdateMovie.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const MovieValidations = {
  createMovieValidation,
  updateMovieValidation
}