import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
// import { UPLOAD_REGEX } from 'utils/constants'
// import path from 'path'
import ApiError from 'utils/ApiError'

const createMovieValidation = async (req, res, next) => {
  try {
    const schemaCreateMovie = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      ageRestriction: Joi.number().valid(0, 13, 16, 18).required(),
      duration: Joi.number().min(30).required(),
      releaseDate: Joi.date().required(),
      endDate: Joi.date().required(),
      //poster: Joi.string().pattern(UPLOAD_REGEX).required(),
      poster: Joi.string().required(),
      trailer: Joi.string().required(),
      language: Joi.string().required(),
      genres: Joi.array().items(Joi.string()).required(),
      actors: Joi.array().items(Joi.string()).required(),
      directors: Joi.array().items(Joi.string()).required()
    })
    await schemaCreateMovie.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

const updateMovieValidation = async (req, res, next) => {
  // if (req.file) {
  //   req.body.poster = path.join('/', req.file.path)
  // }
  try {
    const schemaCreateMovie = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      ageRestriction: Joi.number().valid(0, 13, 16, 18),
      duration: Joi.number().min(30),
      releaseDate: Joi.date(),
      endDate: Joi.date(),
      //poster: Joi.string().pattern(UPLOAD_REGEX),
      poster: Joi.string(),
      trailer: Joi.string(),
      language: Joi.string(),
      genres: Joi.array().items(Joi.string()),
      actors: Joi.array().items(Joi.string()),
      directors: Joi.array().items(Joi.string())
    })
    await schemaCreateMovie.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message) )
  }
}

export const MovieValidations = {
  createMovieValidation,
  updateMovieValidation
}