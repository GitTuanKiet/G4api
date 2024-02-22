/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'config/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const VoucherCollection = 'vouchers'

const schemaCreateVoucher = Joi.object({
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
 * function tìm voucher theo id
 * @param {*} voucherId
 * @returns {Promise<voucher>}
 */
const findOneById = async (voucherId) => {
  try {
    return await getMongo().collection(VoucherCollection).findOne({ _id: fixObjectId(voucherId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm voucher theo userId
 * @param {*} userId
 * @returns {Promise<voucher>}
 */
const findOneByUserId = async (userId) => {
  try {
    return await getMongo().collection(VoucherCollection).findOne({ userId: fixObjectId(userId) })
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
    const result = await getMongo().collection(VoucherCollection).insertOne(voucher)
    return result.ops[0]
  } catch (error) {
    throw error
  }
}

export const VoucherModel = {
  findOneById,
  findOneByUserId,
  createVoucher
}