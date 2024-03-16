/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { UPLOAD_REGEX } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const MovieCollection = 'movies'

const schemaCreateMovie = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  ageRestriction: Joi.number().valid(0, 13, 16, 18).required(),
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

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<movie>}
 */
const validateMovie = async (data) => {
  try {
    return await schemaCreateMovie.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function find by id
 * @param {*} movieId
 * @returns {Promise<movie>}
 */
const findOneById = async (movieId) => {
  try {
    return await getMongo().collection(MovieCollection).findOne({ _id: fixObjectId(movieId) })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch all movies
 * @returns {Promise<array<movies>>}
 */
const fetchAll = async () => {
  try {
    return await getMongo().collection(MovieCollection).find({}).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới movie
 * @param {*} data
 * @returns {Promise<result>}
 */
const createMovie = async (data) => {
  try {
    const value = await validateMovie(data)
    return await getMongo().collection(MovieCollection).insertOne(value)
  } catch (error) {
    throw error
  }
}

/**
 * function update movie
 * @param {*} movieId
 * @param {*} data
 * @returns {Promise<movie>}
 */
const updateMovie = async (movieId, data) => {
  try {
    return await getMongo().collection(MovieCollection).findOneAndUpdate({ _id: fixObjectId(movieId) }, { $set: data }, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

/**
 * function delete movie
 * @param {*} movieId
 * @returns {Promise<movie>}
 */
const deleteMovie = async (movieId) => {
  try {
    return await getMongo().collection(MovieCollection).deleteOne({ _id: fixObjectId(movieId) })
  } catch (error) {
    throw error
  }
}

// export các hàm để sử dụng
export const MovieModels = {
  validateMovie,
  findOneById,
  fetchAll,
  createMovie,
  updateMovie,
  deleteMovie
}

