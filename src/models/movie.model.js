import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
// import { UPLOAD_REGEX } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const MovieCollection = 'movies'

const schemaCreateMovie = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  ageRestriction: Joi.number().valid(0, 13, 16, 18).required(),
  //poster: Joi.string().regex(UPLOAD_REGEX).required(),
  poster: Joi.string().required(),
  trailer: Joi.string().required(),
  duration: Joi.number().required(),
  language: Joi.string().required(),
  releaseDate: Joi.date().required().iso(),
  endDate: Joi.date().required().iso(),
  genres: Joi.array().items(Joi.string()).required(),
  actors: Joi.array().items(Joi.string()).required(),
  directors: Joi.array().items(Joi.string()).required(),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateMovie = async (data) => await schemaCreateMovie.validateAsync(data, { abortEarly: false })
const findOneById = async (movieId) => await getMongo().collection(MovieCollection).findOne({ _id: fixObjectId(movieId) })
const fetchAll = async () => await getMongo().collection(MovieCollection).find({}).toArray()
const createMovie = async (data) => {
  const value = await validateMovie(data)
  return await getMongo().collection(MovieCollection).insertOne(value)
}
const updateMovie = async (movieId, data) => await getMongo().collection(MovieCollection).findOneAndUpdate({ _id: fixObjectId(movieId) }, { $set: data }, { returnDocument: 'after' })
const deleteMovie = async (movieId) => await getMongo().collection(MovieCollection).deleteOne({ _id: fixObjectId(movieId) })


export const MovieModels = {
  validateMovie,
  findOneById,
  fetchAll,
  createMovie,
  updateMovie,
  deleteMovie
}

