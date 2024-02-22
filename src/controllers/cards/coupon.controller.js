import { StatusCodes } from 'http-status-codes'
import { CouponServices } from 'services/cards/coupon.service'

const registerCoupon = async (req, res, next) => {
  try {
    const { userId } = req.user
    const result = await CouponServices.registerCoupon(userId, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const CouponControllers = {
  registerCoupon
}