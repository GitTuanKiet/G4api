/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'config/mongodb'
import { fixObjectId } from 'utils/formatters'
const OrderCollection = 'orders'

const schemaCreateOrder = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().required(),
  links: Joi.array().items(Joi.object({
    href: Joi.string().required(),
    rel: Joi.string().required(),
    method: Joi.string().required()
  })).required()
})

const validateOrder = async (data) => {
  try {
    return await schemaCreateOrder.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    return await getMongo().collection(OrderCollection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

const createOrder = async (data) => {
  try {
    const value = await validateOrder(data)
    return await getMongo().collection(OrderCollection).insertOne(value)
  } catch (error) {
    throw error
  }
}

const updateOrder = async (id, data) => {
  try {
    const value = await validateOrder(data)
    return await getMongo().collection(OrderCollection).findOneAndUpdate(
      { _id: fixObjectId(id) }, { $set: value }, { returnOriginal: false })
  } catch (error) {
    throw error
  }
}

const destroyOrder = async (id) => {
  try {
    return await getMongo().collection(OrderCollection).deleteOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

export const OrderModels = {
  findOneById,
  createOrder,
  updateOrder,
  destroyOrder
}
