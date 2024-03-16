/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const ShowtimeCollection = 'showtimes'

const schemaCreateShowtime = Joi.object({
  movieId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  theaterId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
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


// // Xác định hàm để xóa các bản ghi có thuộc tính 'day' trước thời điểm hiện tại
// async function deletePastShowtimes(now) {
//   try {
//     // Xác định điều kiện để xóa các bản ghi
//     const filter = {
//       day: { $lt: now } // Lọc các bản ghi có thuộc tính 'day' nhỏ hơn thời điểm hiện tại
//     }

//     // Xóa các bản ghi
//     const result = await getMongo().collection(ShowtimeCollection).deleteMany(filter)

//     console.log(`${result.deletedCount} bản ghi đã được xóa.`)

//   } catch (error) {
//     console.error('Lỗi khi xóa các bản ghi:', error)
//     // throw error
//   }
// }

/**
 * function fetch all 30 ngày tới
 * @returns {Promise<array<Showtime>>}
 */
const fetchAll = async () => {
  try {
    const now = new Date()
    const end = new Date(now)
    end.setDate(now.getDate() + 30)
    // const filter = {
    //   day: { $gte: now, $lte: end }
    // }
    // deletePastShowtimes(now)

    return await getMongo().collection(ShowtimeCollection).find({ day: { $lte: end } }).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function find Showtime by id
 * @param {*} showtimeId
 * @returns {Promise<Showtime>}
 */
const findOneById = async (showtimeId) => {
  try {
    return await getMongo().collection(ShowtimeCollection).findOne({ _id: fixObjectId(showtimeId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới Showtime
 * @param {array} data
 * @returns {Promise<Showtime>}
 */
const createManyShowtime = async (data) => {
  try {
    const dataPromises = data.map((item) => validateShowtime(item))

    const validatedData = await Promise.all(dataPromises)

    validatedData.forEach((item) => {
      item.movieId = fixObjectId(item.movieId)
      item.theaterId = fixObjectId(item.theaterId)
    })

    return await getMongo().collection(ShowtimeCollection).insertMany(validatedData)
  } catch (error) {
    throw error
  }
}

/**
 * function update Showtime by id
 * @param {*} showtimeId
 * @param {*} data
 * @returns {Promise<Showtime>}
 */
const updateShowtime = async (showtimeId, data) => {
  if (data.movieId) data.movieId = fixObjectId(data.movieId)
  if (data.theaterId) data.theaterId = fixObjectId(data.theaterId)
  try {
    const update = {
      $set: {
        ...data,
        day: new Date(data.day),
        price: Number(data.price),
        updatedAt: new Date()
      }
    }

    return await getMongo().collection(ShowtimeCollection).findOneAndUpdate({ _id: fixObjectId(showtimeId) }, update, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

/**
 * function delete Showtime by id
 * @param {*} showtimeId
 * @returns {Promise<Showtime>}
 */
const deleteShowtime = async (showtimeId) => {
  try {
    return await getMongo().collection(ShowtimeCollection).deleteOne({ _id: fixObjectId(showtimeId) })
  } catch (error) {
    throw error
  }
}

/**
 * function push booked seat
 * @param {*} showtimeId
 * @param {array} chairs
 * @returns {Promise<Showtime>}
 */
const pushBookedChairs = async (showtimeId, chairs) => {
  try {
    return await getMongo().collection(ShowtimeCollection).updateOne({ _id: fixObjectId(showtimeId) }, { $push: { bookedChairs: { $each: chairs } } })
  } catch (error) {
    throw error
  }
}

const deleteShowtimeByMovieId = async (movieId) => {
  try {
    return await getMongo().collection(ShowtimeCollection).deleteMany({ movieId: fixObjectId(movieId) })
  } catch (error) {
    throw error
  }
}

export const ShowtimeModels = {
  fetchAll,
  findOneById,
  createManyShowtime,
  updateShowtime,
  deleteShowtime,
  pushBookedChairs,
  deleteShowtimeByMovieId
}


