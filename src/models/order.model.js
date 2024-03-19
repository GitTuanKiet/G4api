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
  description: Joi.string(),
  currency: Joi.string().required(),
  price: Joi.number().required(),
  order: Joi.string().valid('ticket', 'voucher', 'gift').required(),
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

const listOrders = async () => {
  try {
    return await getMongo().collection(OrderCollection).find().toArray()
  } catch (error) {
    throw error
  }
}

function calculateTotalPriceByMonth(orders) {
  try {
    const totalPriceByMonth = {}

    // Loop through each order
    orders.forEach(order => {
    // Get the month and year of order's createdAt
      const month = order.createdAt.getMonth()
      const year = order.createdAt.getFullYear()

      // Create a key using month and year
      const key = `${year}-${month + 1}` // Adding 1 to month because getMonth() returns zero-based month

      // If the key doesn't exist in totalPriceByMonth, initialize it
      if (!totalPriceByMonth[key]) {
        totalPriceByMonth[key] = {
          month: month + 1,
          year: year,
          totalAmount: 0,
          orderCount: 0
        }
      }

      // Add order's price to the corresponding month
      totalPriceByMonth[key].totalAmount += order.price
      totalPriceByMonth[key].orderCount++
    })

    // Convert totalPriceByMonth object into an array of month objects
    const result = Object.values(totalPriceByMonth)

    // Sort the result array by month
    result.sort((a, b) => {
    // Compare years first
      if (a.year !== b.year) {
        return a.year - b.year
      }
      // If years are the same, compare months
      return a.month - b.month
    })

    return result
  } catch (error) {
    throw error
  }
}


export const OrderModels = {
  findOneByOrderId,
  createOrder,
  updateOrderByOrderId,
  findManyByUserId,
  listOrders,
  calculateTotalPriceByMonth
}

