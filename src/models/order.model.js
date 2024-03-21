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
  description: Joi.string(),
  currency: Joi.string().required(),
  price: Joi.number().required(),
  order: Joi.string().valid('ticket', 'voucher', 'gift').required(),
  links: Joi.array().items(Joi.object({ href: Joi.string().required(), rel: Joi.string().required(), method: Joi.string().required() })).required(),
  createdAt: Joi.date().default(new Date())
})

const validateOrder = async (data) => await schemaCreateOrder.validateAsync(data, { abortEarly: false })
const findOneByOrderId = async (orderId) => await getMongo().collection(OrderCollection).findOne({ orderId: orderId })
const findManyByUserId = async (userId) => await getMongo().collection(OrderCollection).find({ userId: fixObjectId(userId) }).toArray()
const createOrder = async (data) => {
  const value = await validateOrder(data)
  value.userId = fixObjectId(value.userId)

  return await getMongo().collection(OrderCollection).insertOne(value)
}
const updateOrderByOrderId = async (orderId, data) => {
  if (data.userId) data.userId = fixObjectId(data.userId)

  return await getMongo().collection(OrderCollection).updateOne({ orderId }, { $set: data })
}
const listOrders = async () => await getMongo().collection(OrderCollection).find().toArray()


export const OrderModels = {
  findOneByOrderId,
  createOrder,
  updateOrderByOrderId,
  findManyByUserId,
  listOrders
}

