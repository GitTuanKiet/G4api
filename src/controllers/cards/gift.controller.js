import { StatusCodes } from 'http-status-codes'
import { GiftCardServices } from 'services/cards/gift.service'


const registerGiftCard = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await GiftCardServices.registerGiftCard(_id, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const fetchAllByUserId = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await GiftCardServices.fetchAllByUserId(_id)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const GiftCardControllers = {
  registerGiftCard,
  fetchAllByUserId
}