import { StatusCodes } from 'http-status-codes'
import { CouponServices } from 'services/cards/coupon.service'

const registerCoupon = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await CouponServices.registerCoupon(_id, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const fetchAllByUserId = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await CouponServices.fetchAllByUserId(_id)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const CouponControllers = {
  registerCoupon,
  fetchAllByUserId
}