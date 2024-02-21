/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'config/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const MemberCardCollection = 'member cards'

const schemaCreateMemberCard = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  level: Joi.string().valid('iron', 'bronze', 'silver', 'gold', 'platinum').required(),
  status: Joi.string().valid('active', 'inactive').default('inactive'),
  name: Joi.string().required(),
  // sẽ bổ sung validate cho mã thẻ
  number: Joi.string().required(),
  createdAt: Joi.date().default(new Date())
})

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<memberCard>}
 */
const validateMemberCard = async (data) => {
  try {
    return await schemaCreateMemberCard.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm memberCard theo id
 * @param {*} memberCardId
 * @returns {Promise<memberCard>}
 */
const findOneById = async (memberCardId) => {
  try {
    return await getMongo().collection(MemberCardCollection).findOne({ _id: fixObjectId(memberCardId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tìm memberCard theo userId
 * @param {*} userId
 * @returns {Promise<memberCard>}
 */
const findOneByUserId = async (userId) => {
  try {
    return await getMongo().collection(MemberCardCollection).findOne({ userId: fixObjectId(userId) })
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới memberCard
 * @param {*} data
 * @returns {Promise<memberCard>}
 */
const createMemberCard = async (data) => {
  try {
    const validatedData = await validateMemberCard(data)
    // chuyển đổi userId từ string sang ObjectId
    validatedData.userId = fixObjectId(validatedData.userId)

    return await getMongo().collection(MemberCardCollection).insertOne(validatedData)
  } catch (error) {
    throw error
  }
}

/**
 * function cập nhật memberCard theo id
 * @param {*} memberCardId
 * @param {*} data
 * @returns {Promise<memberCard>}
 */
const updateMemberCard = async (memberCardId, data) => {
  try {
    return await getMongo().collection(MemberCardCollection).findOneAndUpdate(
      { _id: fixObjectId(memberCardId) }, { $set: data }, { returnOriginal: false })
  } catch (error) {
    throw error
  }
}

/**
 * function xóa memberCard theo id
 * @param {*} memberCardId
 * @returns {Promise<memberCard>}
 */
const destroyMemberCard = async (memberCardId) => {
  try {
    return await getMongo().collection(MemberCardCollection).deleteOne({ _id: fixObjectId(memberCardId) })
  } catch (error) {
    throw error
  }
}

export const MemberCardModels = {
  findOneById,
  findOneByUserId,
  createMemberCard,
  updateMemberCard,
  destroyMemberCard
}
