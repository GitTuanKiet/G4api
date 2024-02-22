/* eslint-disable no-useless-catch */
import { GiftCardModels } from 'models/cards/gift.model'
import { UserModels } from 'models/user.model'
import { fixObjectId } from 'utils/formatters'

const InvalidFields = ['_id', 'userId', 'createdAt', 'updatedAt']

const registerGiftCard = async (userId, data) => {
  try {
    // check if gift card already exists
    const giftCard = await GiftCardModels.findOneByUserId(userId)
    if (giftCard) throw new Error('Gift card already exists')

    // lấy _id từ inserted
    const newGiftCard = { userId: userId, ...data }
    const inserted = await GiftCardModels.createGiftCard(newGiftCard)

    // push giftCardId to user
    await UserModels.pushGiftCardIds(userId, fixObjectId(inserted._id))
    return inserted
  } catch (error) {
    throw error
  }
}

export const GiftCardServices = {
  registerGiftCard
}
