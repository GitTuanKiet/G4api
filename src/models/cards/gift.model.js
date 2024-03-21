import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const GiftCardCollection = 'gift cards'

const schemaCreateGiftCard = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  orderId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  value: Joi.number().required(),
  status: Joi.string().valid('active', 'processing', 'used', 'inactive').default('inactive'),
  createdAt: Joi.date().default(new Date()),
  expiredAt: Joi.date().default(new Date() + 6 * 30 * 24 * 60 * 60 * 1000)
})

const validateGiftCard = async (data) => await schemaCreateGiftCard.validateAsync(data, { abortEarly: false })
const fetchAllByUserId = async (userId) => await getMongo().collection(GiftCardCollection).find({ userId: fixObjectId(userId), status: 'active' }).toArray()
const createGift = async (data) => {
  const validatedData = await validateGiftCard(data)
  validatedData.userId = fixObjectId(validatedData.userId)

  return await getMongo().collection(GiftCardCollection).insertOne(validatedData)
}
const updateStatusByOrderId = async (orderId, status) => await getMongo().collection(GiftCardCollection).updateOne({ orderId }, { $set: status })

export const GiftModels = {
  fetchAllByUserId,
  createGift,
  updateStatusByOrderId
}
