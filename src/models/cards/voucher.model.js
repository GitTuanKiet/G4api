/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const VoucherCollection = 'vouchers'

const schemaCreateVoucher = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  orderId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  code: Joi.string().required(),
  discount: Joi.number().required(),
  status: Joi.string().valid('active', 'processing', 'used', 'inactive').default('inactive'),
  createdAt: Joi.date().default(new Date()),
  expiredAt: Joi.date().default(new Date() + 6 * 30 * 24 * 60 * 60 * 1000)
})

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<voucher>}
 */
const validateVoucher = async (data) => {
  try {
    return await schemaCreateVoucher.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch voucher theo userId
 * @param {*} userId
 * @returns {Promise<array<voucher>>}
 */
const fetchAllByUserId = async (userId) => {
  try {
    return await getMongo().collection(VoucherCollection).find({ userId: fixObjectId(userId), status: 'active' }).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới voucher
 * @param {*} data
 * @returns {Promise<voucher>}
 */
const createVoucher = async (data) => {
  try {
    const voucher = await validateVoucher(data)
    voucher.userId = fixObjectId(voucher.userId)
    return await getMongo().collection(VoucherCollection).insertOne(voucher)
  } catch (error) {
    throw error
  }
}

const updateStatusByOrderId = async (orderId, status) => {
  if (!orderId) return
  try {
    return await getMongo().collection(VoucherCollection).updateOne({ orderId }, { $set: status })
  } catch (error) {
    throw error
  }
}

export const VoucherModels = {
  fetchAllByUserId,
  createVoucher,
  updateStatusByOrderId
}