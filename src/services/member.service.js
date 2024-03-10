/* eslint-disable no-useless-catch */
import { MemberCardModels } from 'models/member.model'
import { UserModels } from 'models/user.model'
import { fixObjectId } from 'utils/formatters'
import ApiError from 'utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const InvalidFields = ['_id', 'userId', 'createdAt', 'updatedAt']

const calculateLevel = (points) => {
  let level = 'iron'
  if (points >= 1000) level = 'bronze'
  if (points >= 2000) level = 'silver'
  if (points >= 4000) level = 'gold'
  if (points >= 10000) level = 'platinum'
  return level
}

const getCard = async (userId) => {
  try {
    const user = await UserModels.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    const memberCard = await MemberCardModels.findOneByUserId(userId)
    if (!memberCard) return null

    if (user.POINTS !== memberCard.point) {
      await MemberCardModels.updateMemberCard(memberCard._id, { point: user.POINTS, level: calculateLevel(user.POINTS) })
    }

    return memberCard
  } catch (error) {
    throw error
  }
}

const registerMemberCard = async (userId, data) => {
  try {
    // check if member card already exists
    const memberCard = await MemberCardModels.findOneByUserId(userId)
    if (memberCard) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Member card already exists')

    // calculate level card based on points
    const user = await UserModels.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    // check if user has setup PIN
    const pin = user.PIN
    if (!pin) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Please setup PIN first')
    if (pin !== Number(data.pin)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid PIN')

    const points = user.POINTS
    const level = calculateLevel(points)

    delete data.pin
    // lấy _id từ inserted
    const newMemberCard = { userId: userId, ...data, level, point: points }
    const result = await MemberCardModels.createMemberCard(newMemberCard)

    // update user memberCardId
    await UserModels.updateUser(userId, { memberCardId: fixObjectId(result.insertedId) })
    return result
  } catch (error) {
    throw error
  }
}

const lostMemberCard = async (userId) => {
  try {
    // check if member card already exists
    const memberCard = await MemberCardModels.findOneByUserId(userId)
    if (!memberCard) throw new ApiError(StatusCodes.NOT_FOUND, 'Member card not found')

    // update user memberCardId
    await UserModels.updateUser(userId, { memberCardId: '' })
    return await MemberCardModels.deleteMemberCard(memberCard._id)
  } catch (error) {
    throw error
  }
}

export const MemberCardServices = {
  getCard,
  registerMemberCard,
  lostMemberCard
}
