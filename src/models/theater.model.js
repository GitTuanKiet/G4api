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

const validateTheater = async (data) => await schemaCreateTheater.validateAsync(data, { abortEarly: false })
const findOneById = async (theaterId) => await getMongo().collection(TheaterCollection).findOne({ _id: fixObjectId(theaterId) })
const fetchAll = async () => await getMongo().collection(TheaterCollection).find({}).toArray()
const createTheater = async (data) => {
  const validatedData = await validateTheater(data)

  return await getMongo().collection(TheaterCollection).insertOne(validatedData)
}
const updateTheater = async (theaterId, data) => {
  if (data.cinemaId) data.cinemaId = fixObjectId(data.cinemaId)

  return await getMongo().collection(TheaterCollection).updateOne({ _id:  fixObjectId(theaterId) }, { set: data })
}

export const TheaterModels = {
  findOneById,
  fetchAll,
  createTheater,
  updateTheater
}
