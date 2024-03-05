/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_REGEX } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const OrderCollection = 'orders'

const schemaCreateOrder = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  payment: Joi.string().valid('paypal', 'momo', 'zalopay', 'vnpay').required(),
  orderId: Joi.string().required(),
  status: Joi.string().valid('CREATED', 'APPROVED', 'COMPLETED', 'VOIDED', 'REFUNDED').required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string().valid('ticket', 'voucher', 'gift').required(),
  links: Joi.array().items(Joi.object({ href: Joi.string().required(), rel: Joi.string().required(), method: Joi.string().required() })).required(),
  createdAt: Joi.date().default(new Date())
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
const findOneByOrderId = async (orderId) => {
  try {
    return await getMongo().collection(OrderCollection).findOne({ orderId: orderId })
  } catch (error) {
    throw error
  }
}

const findManyByUserId = async (userId) => {
  try {
    return await getMongo().collection(OrderCollection).find({ userId: fixObjectId(userId) }).toArray()
  } catch (error) {
    throw error
  }
}

const createOrder = async (data) => {
  try {
    const value = await validateOrder(data)
    value.userId = fixObjectId(value.userId)
    return await getMongo().collection(OrderCollection).insertOne(value)
  } catch (error) {
    throw error
  }
}

const updateOrderByOrderId = async (orderId, data) => {
  if (data.userId) {
    data.userId = fixObjectId(data.userId)
  }
  try {
    return await getMongo().collection(OrderCollection).updateOne({ orderId }, { $set: data })
  } catch (error) {
    throw error
  }
}

export const OrderModels = {
  findOneById,
  findOneByOrderId,
  createOrder,
  updateOrderByOrderId,
  findManyByUserId
}
