import { StatusCodes } from 'http-status-codes'
import { GiftCardServices } from 'services/cards/gift.service'


const registerGiftCard = async (req, res, next) => {
  try {
    const { userId } = req.user
    const result = await GiftCardServices.registerGiftCard(userId, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const GiftCardControllers = {
  registerGiftCard
}