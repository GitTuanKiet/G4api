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

const validateVoucher = async (data) => await schemaCreateVoucher.validateAsync(data, { abortEarly: false })
const fetchAllByUserId = async (userId) => await getMongo().collection(VoucherCollection).find({ userId: fixObjectId(userId), status: 'active' }).toArray()
const createVoucher = async (data) => {
  const voucher = await validateVoucher(data)
  voucher.userId = fixObjectId(voucher.userId)

  return await getMongo().collection(VoucherCollection).insertOne(voucher)
}
const updateStatusByOrderId = async (orderId, status) => await getMongo().collection(VoucherCollection).updateOne({ orderId }, { $set: status })

export const VoucherModels = {
  fetchAllByUserId,
  createVoucher,
  updateStatusByOrderId
}