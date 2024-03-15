/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_REGEX } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const TheaterCollection = 'theaters'

const schemaCreateTheater = Joi.object({
  name: Joi.string().required(),
  cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
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
const validateTheater = async (data) => {
  try {
    return await schemaCreateTheater.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (theaterId) => {
  try {
    return await getMongo().collection(TheaterCollection).findOne({ _id: fixObjectId(theaterId) })
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
    return await getMongo().collection(TheaterCollection).find({}).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới theater
 * @param {*} data
 * @returns {Promise<theater>}
 */
const createTheater = async (data) => {
  try {
    const validatedData = await validateTheater(data)

    return await getMongo().collection(TheaterCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const updateTheater = async (theaterId, data) => {
  if (data.cinemaId) data.cinemaId = fixObjectId(data.cinemaId)
  try {
    return await getMongo().collection(TheaterCollection).updateOne(
      { _id:  fixObjectId(theaterId) },
      { set: data }
    )
  } catch (error) {
    throw error
  }
}

export const TheaterModels = {
  findOneById,
  fetchAll,
  createTheater,
  updateTheater
}
