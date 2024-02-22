import express from 'express'

import { CouponControllers } from 'controllers/cards/coupon.controller'
import { CouponValidations } from 'validations/cards/coupon.validation'

const router = express.Router()

router.route('/register')
  .post(CouponValidations.registerCoupon, CouponControllers.registerCoupon)


module.exports = router
