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

const validateCinema = async (data) => await schemaCreateCinema.validateAsync(data, { abortEarly: false })
const findOneById = async (cinemaId) => await getMongo().collection(CinemaCollection).findOne({ _id: fixObjectId(cinemaId) })
const fetchAll = async () => await getMongo().collection(CinemaCollection).find({}).toArray()
const createCinema = async (data) => {
  const validatedData = await validateCinema(data)

  return await getMongo().collection(CinemaCollection).insertOne(validatedData)
}
const updateCinema = async (cinemaId, data) => await getMongo().collection(CinemaCollection).updateOne({ _id: fixObjectId(cinemaId) }, { set: data })

export const CinemaModels = {
  findOneById,
  fetchAll,
  createCinema,
  updateCinema
}
