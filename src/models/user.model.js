/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE, UPLOAD_REGEX } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const UserCollection = 'users'

const schemaCreateUser = Joi.object({
  // info user
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().regex(/^[0-9]{10}$/).default(''),
  city: Joi.string().default(''),
  address: Joi.string().default(''),
  gender: Joi.string().valid('male', 'female', 'none').default('none'),
  avatar: Joi.string().pattern(UPLOAD_REGEX),
  birthday: Joi.date().default(new Date()),

  // _id của các collection khác
  memberCardId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).default(''),
  voucherIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE)).default([]),
  giftIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE)).default([]),
  couponIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE)).default([]),
  orderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE)).default([]),

  role: Joi.string().valid('user', 'admin').default('user'),
  POINTS: Joi.number().default(0),
  PIN: Joi.number().default(0),
  isEmailVerified: Joi.boolean().default(false),
  // emailVerificationToken: Joi.string().default(''),
  // passwordResetToken: Joi.string().default(''),
  // passwordResetExpires: Joi.date().default(null),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

/**
 * function validate data trước khi register
 * @param {*} data
 * @returns {Promise<user>}
 */
const validateUser = async (data) => {
  try {
    return await schemaCreateUser.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm user theo id
 * @param {*} userId
 * @returns {Promise<user>}
 */
const findOneById = async (userId) => {
  try {
    return await getMongo().collection(UserCollection).findOne({ _id: fixObjectId(userId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm user theo email
 * @param {*} email
 * @returns {Promise<user>}
 */
const findOneByEmail = async (email) => {
  try {
    return await getMongo().collection(UserCollection).findOne({ email: email })
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới user
 * @param {*} data
 * @returns {Promise<user>}
 */
const createUser = async (data) => {
  try {
    const value = await validateUser(data)
    return await getMongo().collection(UserCollection).insertOne(value)
  } catch (error) {
    throw error
  }
}

const updateUser = async (userId, data) => {
  try {
    return await getMongo().collection(UserCollection).findOneAndUpdate({ _id: fixObjectId(userId) }, { $set: data }, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

const pushGiftCardIds = async (userId, giftCardId) => {
  try {
    return await getMongo().collection(UserCollection).findOneAndUpdate({ _id: fixObjectId(userId) }, { $push: { giftIds: giftCardId } }, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

const pushVoucherIds = async (userId, voucherId) => {
  try {
    return await getMongo().collection(UserCollection).findOneAndUpdate({ _id: fixObjectId(userId) }, { $push: { voucherIds: voucherId } }, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

const pushCouponIds = async (userId, couponId) => {
  try {
    return await getMongo().collection(UserCollection).findOneAndUpdate({ _id: fixObjectId(userId) }, { $push: { couponIds: couponId } }, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

const pushOrderIds = async (userId, orderId) => {
  try {
    return await getMongo().collection(UserCollection).findOneAndUpdate({ _id: fixObjectId(userId) }, { $push: { orderIds: orderId } }, { returnDocument: 'after' })
  } catch (error) {
    throw error
  }
}

// export các hàm để sử dụng ở controller
export const UserModels = {
  findOneById,
  findOneByEmail,
  createUser,
  updateUser,
  pushGiftCardIds,
  pushVoucherIds,
  pushCouponIds,
  pushOrderIds
}