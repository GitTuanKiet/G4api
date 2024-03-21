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

const validateShowtime = async (data) => await schemaCreateShowtime.validateAsync(data, { abortEarly: false })
const fetchAll = async () => {
  const now = new Date()
  const end = new Date(now)
  end.setDate(now.getDate() + 30)

  return await getMongo().collection(ShowtimeCollection).find({ day: { $lte: end } }).toArray()
}
const findOneById = async (showtimeId) => await getMongo().collection(ShowtimeCollection).findOne({ _id: fixObjectId(showtimeId) })
const createManyShowtime = async (data) => {
  const dataPromises = data.map((item) => validateShowtime(item))

  const validatedData = await Promise.all(dataPromises)

  validatedData.forEach((item) => {
    item.movieId = fixObjectId(item.movieId)
    item.theaterId = fixObjectId(item.theaterId)
  })

  return await getMongo().collection(ShowtimeCollection).insertMany(validatedData)
}
const updateShowtime = async (showtimeId, data) => {
  if (data.movieId) data.movieId = fixObjectId(data.movieId)
  if (data.theaterId) data.theaterId = fixObjectId(data.theaterId)
  const update = {
    $set: {
      ...data,
      day: new Date(data.day),
      price: Number(data.price),
      updatedAt: new Date()
    }
  }

  return await getMongo().collection(ShowtimeCollection).findOneAndUpdate({ _id: fixObjectId(showtimeId) }, update, { returnDocument: 'after' })
}
const deleteShowtime = async (showtimeId) => await getMongo().collection(ShowtimeCollection).deleteOne({ _id: fixObjectId(showtimeId) })
const pushBookedChairs = async (showtimeId, chairs) => await getMongo().collection(ShowtimeCollection).updateOne({ _id: fixObjectId(showtimeId) }, { $push: { bookedChairs: { $each: chairs } } })
const deleteShowtimeByMovieId = async (movieId) => await getMongo().collection(ShowtimeCollection).deleteMany({ movieId: fixObjectId(movieId) })

export const ShowtimeModels = {
  fetchAll,
  findOneById,
  createManyShowtime,
  updateShowtime,
  deleteShowtime,
  pushBookedChairs,
  deleteShowtimeByMovieId
}


