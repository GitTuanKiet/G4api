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

const validateCoupon = async (data) => await schemaCreateCoupon.validateAsync(data, { abortEarly: false })
const fetchAllByUserId = async (userId) => await getMongo().collection(CouponCollection).find({ userId: fixObjectId(userId), status: 'active' }).toArray()
const createCoupon = async (data) => {
  const validatedData = await validateCoupon(data)
  validatedData.userId = fixObjectId(validatedData.userId)

  return await getMongo().collection(CouponCollection).insertOne(validatedData)
}
const updateStatusByOrderId = async (orderId, status) => await getMongo().collection(CouponCollection).updateOne({ orderId }, { $set: status })

export const CouponModels = {
  fetchAllByUserId,
  createCoupon,
  updateStatusByOrderId
}