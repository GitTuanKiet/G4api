/* eslint-disable no-useless-catch */
import { MemberCardModels } from 'models/cards/member.model'
import { UserModels } from 'models/user.model'

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

    const newMemberCard = { userId: userId, ...data, level }

    return await MemberCardModels.createMemberCard(newMemberCard)
  } catch (error) {
    throw error
  }
}

export const MemberCardServices = {
  registerMemberCard
}
