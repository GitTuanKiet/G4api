/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const ShowtimeCollection = 'showtimes'

const schemaCreateShowtime = Joi.object({
  movieId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  day: Joi.date().required(),
  start: Joi.number().min(7).max(20).required(),
  end: Joi.number().min(10).max(23).required(),
  price: Joi.number().required(),
  bookedChairs: Joi.array().items(Joi.string().required()).default([]),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<Showtime>}
 */
const validateShowtime = async (data) => {
  try {
    return await schemaCreateShowtime.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch all 30 ngày tới
 * @returns {Promise<array<Showtime>>}
 */
const fetchAll = async () => {
  try {
    const now = new Date()
    const end = new Date(now)
    end.setDate(now.getDate() + 30)

    return await getMongo().collection(ShowtimeCollection).find({
      day: { $gte: now, $lte: end }
    }).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới Showtime
 * @param {*} data
 * @returns {Promise<Showtime>}
 */
const createShowtime = async (data) => {
  try {
    const validatedData = await validateShowtime(data)
    validatedData.movieId = fixObjectId(validatedData.movieId)
    validatedData.cinemaId = fixObjectId(validatedData.cinemaId)

    return await getMongo().collection(ShowtimeCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

/**
 * function update Showtime by id
 * @param {*} ShowtimeId
 * @param {*} data
 * @returns {Promise<Showtime>}
 */
const updateShowtime = async (ShowtimeId, data) => {
  if (data.movieId) data.movieId = fixObjectId(data.movieId)
  if (data.cinemaId) data.cinemaId = fixObjectId(data.cinemaId)
  try {
    const update = {
      $set: {
        ...data,
        updatedAt: new Date()
      }
    }

    return await getMongo().collection(ShowtimeCollection).findOneAndUpdate({ _id: fixObjectId(ShowtimeId) }, update, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

/**
 * function delete Showtime by id
 * @param {*} ShowtimeId
 * @returns {Promise<Showtime>}
 */
const deleteShowtime = async (ShowtimeId) => {
  try {
    return await getMongo().collection(ShowtimeCollection).deleteOne({ _id: fixObjectId(ShowtimeId) })
  } catch (error) {
    throw error
  }
}

/**
 * function push booked seat
 * @param {*} ShowtimeId
 * @param {array} chairs
 * @returns {Promise<Showtime>}
 */
const pushBookedChairs = async (ShowtimeId, chairs) => {
  try {
    return await getMongo().collection(ShowtimeCollection).updateOne({ _id: fixObjectId(ShowtimeId) }, { $push: { bookedChairs: { $each: chairs } } })
  } catch (error) {
    throw error
  }
}

export const ShowtimeModels = {
  fetchAll,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  pushBookedChairs
}