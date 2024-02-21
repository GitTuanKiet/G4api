/* eslint-disable no-useless-catch */
import { MemberCardModels } from 'models/cards/member.model'
import { UserModels } from 'models/user.model'
import { fixObjectId } from 'utils/formatters'

const InvalidFields = ['_id', 'userId', 'createdAt', 'updatedAt']

const registerMemberCard = async (userId, data) => {
  try {
    // check if member card already exists
    const memberCard = await MemberCardModels.findOneByUserId(userId)
    if (memberCard) throw new Error('Member card already exists')

    // calculate level card based on points
    const user = await UserModels.findOneById(userId)
    if (!user) throw new Error('User not found')

    const points = user.POINTS
    let level = 'iron'
    if (points >= 1000) level = 'bronze'
    if (points >= 5000) level = 'silver'
    if (points >= 10000) level = 'gold'
    if (points >= 50000) level = 'platinum'

    // lấy _id từ inserted
    const newMemberCard = { userId: userId, ...data, level }
    const inserted = await MemberCardModels.createMemberCard(newMemberCard)

    // update user memberCardId
    await UserModels.updateUser(userId, { memberCardId: fixObjectId(inserted._id) })
    return inserted
  } catch (error) {
    throw error
  }
}

export const MemberCardServices = {
  registerMemberCard
}
