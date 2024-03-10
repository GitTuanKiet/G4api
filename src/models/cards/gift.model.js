/* eslint-disable no-useless-catch */
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

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<giftCard>}
 */
const validateGiftCard = async (data) => {
  try {
    return await schemaCreateGiftCard.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch giftCard theo userId
 * @param {*} userId
 * @returns {Promise<array<giftCard>>}
 */
const fetchAllByUserId = async (userId) => {
  try {
    return await getMongo().collection(GiftCardCollection).find({ userId: fixObjectId(userId), status: 'active' }).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới giftCard
 * @param {*} data
 * @returns {Promise<giftCard>}
 */
const createGift = async (data) => {
  try {
    const validatedData = await validateGiftCard(data)
    validatedData.userId = fixObjectId(validatedData.userId)

    return await getMongo().collection(GiftCardCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

const updateStatusByOrderId = async (orderId, status) => {
  if (!orderId) return
  try {
    return await getMongo().collection(GiftCardCollection).updateOne({ orderId }, { $set: status })
  } catch (error) {
    throw error
  }
}

export const GiftModels = {
  fetchAllByUserId,
  createGift,
  updateStatusByOrderId
}
