/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const CouponCollection = 'coupons'

const schemaCreateCoupon = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  orderId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().valid(100, 200, 300, 500, 1000).required(),
  status: Joi.string().valid('active', 'processing', 'used', 'inactive').default('inactive'),
  createdAt: Joi.date().default(new Date()),
  expiredAt: Joi.date().default(new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000))
})

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<coupon>}
 */
const validateCoupon = async (data) => {
  try {
    return await schemaCreateCoupon.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch coupon theo userId
 * @param {*} userId
 * @returns {Promise<array<coupon>>}
 */
const fetchAllByUserId = async (userId) => {
  try {
    return await getMongo().collection(CouponCollection).find({ userId: fixObjectId(userId), status: 'active' }).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới coupon
 * @param {*} data
 * @returns {Promise<coupon>}
 */
const createCoupon = async (data) => {
  try {
    const validatedData = await validateCoupon(data)
    validatedData.userId = fixObjectId(validatedData.userId)
    return await getMongo().collection(CouponCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const updateStatusByOrderId = async (orderId, status) => {
  if (!orderId) return
  try {
    return await getMongo().collection(CouponCollection).updateOne({ orderId }, { $set: status })
  } catch (error) {
    throw error
  }
}

export const CouponModels = {
  fetchAllByUserId,
  createCoupon,
  updateStatusByOrderId
}