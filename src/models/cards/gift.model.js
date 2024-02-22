/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'config/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const GiftCardCollection = 'gift cards'

const schemaCreateGiftCard = Joi.object({
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
 * function tìm giftCard theo id
 * @param {*} giftCardId
 * @returns {Promise<giftCard>}
 */
const findOneById = async (giftCardId) => {
  try {
    return await getMongo().collection(GiftCardCollection).findOne({ _id: fixObjectId(giftCardId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm giftCard theo userId
 * @param {*} userId
 * @returns {Promise<giftCard>}
 */
const findOneByUserId = async (userId) => {
  try {
    return await getMongo().collection(GiftCardCollection).findOne({ userId: fixObjectId(userId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới giftCard
 * @param {*} data
 * @returns {Promise<giftCard>}
 */
const createGiftCard = async (data) => {
  try {
    const validatedData = await validateGiftCard(data)
    validatedData.userId = fixObjectId(validatedData.userId)

    return await getMongo().collection(GiftCardCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

/**
 * function cập nhật giftCard
 * @param {*} giftCardId
 * @param {*} data
 * @returns {Promise<giftCard>}
 */
const updateGiftCard = async (giftCardId, data) => {
  try {
    const validated = await validateGiftCard(data)
    return await getMongo().collection(GiftCardCollection).findOneAndUpdate(
      { _id: fixObjectId(giftCardId) },
      { $set: validated },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw error
  }
}

/**
 * function xóa giftCard
 * @param {*} giftCardId
 * @returns {Promise<giftCard>}
 */
const destroyGiftCard = async (giftCardId) => {
  try {
    return await getMongo().collection(GiftCardCollection).findOneAndDelete({ _id: fixObjectId(giftCardId) })
  } catch (error) {
    throw error
  }
}

export const GiftCardModels = {
  findOneById,
  findOneByUserId,
  createGiftCard,
  updateGiftCard,
  destroyGiftCard
}
