/* eslint-disable no-useless-catch */
import { CouponModels } from 'models/cards/coupon.model'
import { UserModels } from 'models/user.model'
import { fixObjectId } from 'utils/formatters'

const InvalidFields = ['_id', 'userId', 'createdAt', 'updatedAt']

const registerCoupon = async (userId, data) => {
  try {
    // check if coupon already exists
    const coupon = await CouponModels.findOneByUserId(userId)
    if (coupon) throw new Error('Coupon already exists')

    // lấy _id từ inserted
    const newCoupon = { userId: userId, ...data }
    const inserted = await CouponModels.createCoupon(newCoupon)

    // push couponId to user
    await UserModels.pushCouponIds(userId, fixObjectId(inserted._id))
    return inserted
  } catch (error) {
    throw error
  }
}

export const CouponServices = {
  registerCoupon
}