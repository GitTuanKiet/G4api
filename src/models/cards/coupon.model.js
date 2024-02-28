/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const CouponCollection = 'coupons'

const schemaCreateCoupon = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().valid(100, 200, 300, 500, 1000).required(),
  status: Joi.string().valid('active', 'inactive').default('inactive'),
  createdAt: Joi.date().default(new Date())
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
 * function tìm coupon theo id
 * @param {*} couponId
 * @returns {Promise<coupon>}
 */
const findOneById = async (couponId) => {
  try {
    return await getMongo().collection(CouponCollection).findOne({ _id: fixObjectId(couponId) })
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
    return await getMongo().collection(CouponCollection).find({ userId: fixObjectId(userId) }).toArray()
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
    const inserted = await getMongo().collection(CouponCollection).insertOne(validatedData)
    return inserted
  } catch (error) {
    throw error
  }
}

export const CouponModels = {
  findOneById,
  fetchAllByUserId,
  createCoupon
}