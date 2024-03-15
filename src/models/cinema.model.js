/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { fixObjectId } from 'utils/formatters'

const CinemaCollection = 'cinemas'

const schemaCreateCinema = Joi.object({
  name: Joi.string().required(),
  city: Joi.string().required(),
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
    return await getMongo().collection(CinemaCollection).updateOne(
      { _id: fixObjectId(cinemaId) },
      { set: data }
    )
  } catch (error) {
    throw error
  }
}

export const CinemaModels = {
  findOneById,
  fetchAll,
  createCinema,
  updateCinema
}
