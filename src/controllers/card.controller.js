import { StatusCodes } from 'http-status-codes'
import { CardServices } from 'services/card.service'

const fetchAllByUserId = async (req, res, next) => {
  try {
    const { _id } = req.user
    const cards = await CardServices.fetchAllByUserId(_id)

    return res.status(StatusCodes.OK).json(cards)
  } catch (error) {
    next(error)
  }
}

export const CardControllers = {
  fetchAllByUserId
}