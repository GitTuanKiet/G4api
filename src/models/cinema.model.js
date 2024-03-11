/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { fixObjectId } from 'utils/formatters'

const CinemaCollection = 'cinemas'

const schemaCreateCinema = Joi.object({
  name: Joi.string().required(),
  city: Joi.string().required(),
  type: Joi.string().valid('2D', '3D', '4D').required(),
  roomMap: Joi.array().items(Joi.object({
    chair: Joi.string().required(),
    type: Joi.string().valid('normal', 'vip', 'couple', 'disable').required()
  })).required(),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<cinema>}
 */
const validateCinema = async (data) => {
  try {
    return await schemaCreateCinema.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (cinemaId) => {
  try {
    return await getMongo().collection(CinemaCollection).findOne({ _id: fixObjectId(cinemaId) })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch all cinemas
 * @returns {Promise<array<cinema>>}
 */
const fetchAll = async () => {
  try {
    return await getMongo().collection(CinemaCollection).find({}).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới cinema
 * @param {*} data
 * @returns {Promise<cinema>}
 */
const createCinema = async (data) => {
  try {
    const validatedData = await validateCinema(data)

    return await getMongo().collection(CinemaCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const updateCinema = async (cinemaId, data) => {
  try {
    const update = {
      $set: {
        ...data,
        updatedAt: new Date()
      }
    }

    return await getMongo().collection(CinemaCollection).updateOne(
      { _id:  fixObjectId(cinemaId) },
      update
    )
  } catch (error) {
    throw error
  }
}

export const CinemaModels = {
  findOneById,
  fetchAll,
  createCinema,
  updateCinema,
  listCinemaNameId
}

const listCinemaNameId = async () => {
  try {
    return await getMongo().collection(CinemaCollection).find({}, { projection: { _id: 1, name: 1 } }).toArray()
  } catch (error) {
    throw error
  }
}